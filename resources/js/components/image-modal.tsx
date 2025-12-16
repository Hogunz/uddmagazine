import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";


interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
    altText?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, altText }: ImageModalProps) {
    if (!imageUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none text-white">
                <div className="sr-only">
                    <DialogTitle>{altText || "Image Gallery"}</DialogTitle>
                    <DialogDescription>Full size view of gallery image</DialogDescription>
                </div>
                <div className="relative flex items-center justify-center w-full h-full max-h-[80vh]">
                    <img
                        src={imageUrl}
                        alt={altText || "Gallery Image"}
                        className="max-w-full max-h-[80vh] object-contain rounded-md"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
