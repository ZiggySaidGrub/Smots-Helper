const { Jimp } = require('jimp');

async function overlayImages(baseImagePath, overlayImageUrl, outputPath, opacity = 0.5) {
    try {
        // Load the base image (local file)
        const baseImage = await Jimp.read(baseImagePath);

        // Load the overlay image (from URL)
        const overlayImage = await Jimp.read(overlayImageUrl);

        // Get base image dimensions
        const { width, height } = baseImage.bitmap;

        // Resize overlay while keeping aspect ratio and covering the base image
        overlayImage.resize({w:width, h:height});

        // Adjust opacity of overlay
        overlayImage.opacity(opacity);

        // Overlay the image centered on the base
        baseImage.composite(overlayImage, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: opacity
        });

        // Save the result
        await baseImage.write(outputPath); 
        console.log(`Image saved to ${outputPath}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Export the function as a module
module.exports = overlayImages;


