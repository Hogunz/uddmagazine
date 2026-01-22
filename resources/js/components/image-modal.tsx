import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl?: string | null;  // Kept for backward compatibility but optional now
    images?: string[];         // New prop for full gallery support
    initialIndex?: number;     // Index to start at
    altText?: string;
}

export default function ImageModal({
    isOpen,
    onClose,
    imageUrl,
    images = [],
    initialIndex = 0,
    altText
}: ImageModalProps) {
    // If only a single imageUrl is provided, treat it as a single-item array
    const effectiveImages = images.length > 0 ? images : (imageUrl ? [imageUrl] : []);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Reset index when modal opens with new initialIndex
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, effectiveImages]);

    if (effectiveImages.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % effectiveImages.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + effectiveImages.length) % effectiveImages.length);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[100vw] h-[100vh] w-full p-0 bg-transparent border-none shadow-none text-white flex flex-col justify-center items-center gap-0 focus:outline-none">
                <div className="sr-only">
                    <DialogTitle>{altText || "Image Gallery"}</DialogTitle>
                    <DialogDescription>
                        Image {currentIndex + 1} of {effectiveImages.length}
                    </DialogDescription>
                </div>

                {/* Close Button - absolute top right */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 z-50 rounded-full h-10 w-10 md:h-12 md:w-12"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>

                {/* Main Content Container */}
                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
                    {/* Previous Button */}
                    {effectiveImages.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full h-10 w-10 md:h-12 md:w-12 z-50"
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        >
                            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
                        </Button>
                    )}

                    {/* Image */}
                    <div
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={onClose} // Clicking backdrop closes modal
                    >
                        <img
                            src={effectiveImages[currentIndex]}
                            alt={altText || `Gallery Image ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain cursor-default"
                            onClick={(e) => e.stopPropagation()} // Clicking image doesn't close modal
                        />
                    </div>

                    {/* Next Button */}
                    {effectiveImages.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full h-10 w-10 md:h-12 md:w-12 z-50"
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        >
                            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                        </Button>
                    )}
                </div>

                {/* Counter */}
                {effectiveImages.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm pointer-events-none">
                        {currentIndex + 1} / {effectiveImages.length}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
