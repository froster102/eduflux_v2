import type { Selection } from "@cropper/element-selection";

import { Button } from "@heroui/button";
import Cropper, { CropperImage } from "cropperjs";
import React from "react";

interface ImageCropperProps {
  src: string;
  onCrop?: (canvas: HTMLCanvasElement | null) => void;
  initialCoverage?: number;
  selectionWidth?: number;
  selectionHeight?: number;
}

export default function ImageCropper({
  src,
  onCrop,
  initialCoverage = 0.5,
  selectionWidth = 750,
  selectionHeight = 422,
}: ImageCropperProps) {
  const [cropper, setCropper] = React.useState<Cropper | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (containerRef.current && imageRef.current && src) {
      const cropperInstance = new Cropper(imageRef.current, {
        container: containerRef.current,
        template: `
          <cropper-canvas style="width: 100%; max-width: 100%; min-width: 0; min-height: 0;">
            <cropper-image src="${src}" initial-center-size="cover" rotatable scalable translatable></cropper-image>
            <cropper-shade hidden></cropper-shade>
            <cropper-handle action="select" plain></cropper-handle>
            <cropper-selection
              initial-coverage="${initialCoverage}"
              initial-aspect-ratio="${selectionWidth / selectionHeight}"
              aspect-ratio="${selectionWidth / selectionHeight}"
              movable
              resizable
              zoomable
              restrict-to="canvas"
              min-width="50"
              min-height="${50 * (selectionHeight / selectionWidth)}"
              max-width="100%"
              max-height="100%"
              dynamic="true"
            >
              <cropper-grid role="grid" covered></cropper-grid>
              <cropper-crosshair centered></cropper-crosshair>
              <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
              <cropper-handle action="n-resize"></cropper-handle>
              <cropper-handle action="e-resize"></cropper-handle>
              <cropper-handle action="s-resize"></cropper-handle>
              <cropper-handle action="w-resize"></cropper-handle>
              <cropper-handle action="ne-resize"></cropper-handle>
              <cropper-handle action="nw-resize"></cropper-handle>
              <cropper-handle action="se-resize"></cropper-handle>
              <cropper-handle action="sw-resize"></cropper-handle>
            </cropper-selection>
          </cropper-canvas>
        `,
      });

      const handleImageLoad = () => {
        const selection = cropperInstance.getCropperSelection();
        const canvas = cropperInstance.getCropperCanvas();
        const image = cropperInstance.getCropperImage();

        if (selection && canvas && image) {
          const containerWidth = containerRef.current?.offsetWidth || 448;
          const canvasHeight =
            (containerWidth * selectionHeight) / selectionWidth;

          canvas.style.width = `${containerWidth}px`;
          canvas.style.height = `${canvasHeight}px`;
          canvas.style.minWidth = "0";
          canvas.style.minHeight = "0";

          image.$center();

          selection.width = containerWidth * initialCoverage;
          selection.height =
            (selection.width * selectionHeight) / selectionWidth;
          selection.$center();
          selection.$render();
        }
      };

      const handleImageTransform = (event: CustomEvent) => {
        const cropperCanvas = cropperInstance.getCropperCanvas();
        const cropperImage = cropperInstance.getCropperImage();

        if (!cropperCanvas || !cropperImage) {
          return;
        }

        const canvasRect = cropperCanvas.getBoundingClientRect();
        const imageClone = cropperImage.cloneNode() as CropperImage;

        imageClone.style.transform = `matrix(${event.detail.matrix.join(", ")})`;
        imageClone.style.opacity = "0";
        cropperCanvas.appendChild(imageClone);
        const imageRect = imageClone.getBoundingClientRect();

        cropperCanvas.removeChild(imageClone);

        const isCoveringCanvas =
          imageRect.left <= canvasRect.left &&
          imageRect.top <= canvasRect.top &&
          imageRect.right >= canvasRect.right &&
          imageRect.bottom >= canvasRect.bottom;

        if (!isCoveringCanvas) {
          event.preventDefault();
        }
      };

      const handleSelectionChange = (event: CustomEvent<Selection>) => {
        const selection = cropperInstance.getCropperSelection();
        const canvas = cropperInstance.getCropperCanvas();

        if (selection && canvas) {
          const canvasRect = canvas.getBoundingClientRect();
          const selectionData = event.detail;

          const maxSelection: Selection = {
            x: 0,
            y: 0,
            width: canvasRect.width,
            height: canvasRect.height,
          };

          const isWithinCanvas =
            selectionData.x >= maxSelection.x &&
            selectionData.y >= maxSelection.y &&
            selectionData.x + selectionData.width <=
              maxSelection.x + maxSelection.width &&
            selectionData.y + selectionData.height <=
              maxSelection.y + maxSelection.height;

          if (!isWithinCanvas) {
            event.preventDefault();
          }
        }
      };

      const cropperSelection = cropperInstance.getCropperSelection();
      const cropperImage = cropperInstance.getCropperImage();

      if (cropperSelection) {
        cropperSelection.addEventListener(
          "change",
          handleSelectionChange as EventListener,
        );
      }
      if (cropperImage) {
        cropperImage.addEventListener(
          "transform",
          handleImageTransform as EventListener,
        );
      }

      imageRef.current.addEventListener("load", handleImageLoad);
      setCropper(cropperInstance);

      return () => {
        if (cropperSelection) {
          cropperSelection.removeEventListener(
            "change",
            handleSelectionChange as EventListener,
          );
        }
        if (cropperImage) {
          cropperImage.removeEventListener(
            "transform",
            handleImageTransform as EventListener,
          );
        }
        if (imageRef.current) {
          imageRef.current.removeEventListener("load", handleImageLoad);
        }
        if (containerRef.current) {
          const cropperCanvas =
            containerRef.current.querySelector("cropper-canvas");

          if (cropperCanvas) {
            cropperCanvas.remove();
          }
        }
      };
    }
  }, [src, initialCoverage, selectionWidth, selectionHeight]);

  const handleCrop = async () => {
    if (cropper) {
      const selection = cropper.getCropperSelection();

      if (selection && selection.width > 0 && selection.height > 0) {
        try {
          const canvas = await selection.$toCanvas({
            width: selectionWidth,
            height: selectionHeight,
          });

          onCrop?.(canvas);
        } catch {
          // console.error("Error generating canvas:", error);
          onCrop?.(null);
        }
      } else {
        // console.warn("Invalid selection: width or height is zero");
        onCrop?.(null);
      }
    }
  };

  const handleCancel = () => {
    onCrop?.(null);
  };

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full bg-gray-100">
        <img ref={imageRef} alt="Crop preview" className="hidden" src={src} />
      </div>
      <div className="flex gap-2 mt-4">
        <Button color="primary" size="sm" onPress={handleCrop}>
          Crop Image
        </Button>
        <Button color="danger" size="sm" variant="flat" onPress={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
