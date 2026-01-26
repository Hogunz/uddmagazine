<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Remove existing CSP header to avoid conflict if set by another middleware
        // This only works if the other middleware ran before this one, 
        // or if we modify the header bag.
        $response->headers->remove('Content-Security-Policy');

        // Set a permissive CSP that allows inline styles/scripts and blobs
        // This is needed for the rich text editor and the dark mode script
        $csp = "default-src 'self' http: https: data: blob:; " .
               "script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: data:; " .
               "style-src 'self' 'unsafe-inline' http: https: data:; " .
               "img-src 'self' data: blob: http: https:; " .
               "font-src 'self' data: http: https:; " .
               "connect-src 'self' http: https:;";

        $response->headers->set('Content-Security-Policy', $csp);
        
        return $response;
    }
}
