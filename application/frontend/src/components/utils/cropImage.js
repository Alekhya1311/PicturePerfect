/**
 * @param {File} imageSrc 
 * @param {Object} pixelCrop 
 * @param {number} rotation 
 */
import { FilterContext } from '../Post/post';
import html2canvas from 'html2canvas';




const createImage = (url) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous"); 
		image.src = url;
	});

function getRadianAngle(degreeValue) {
	return (degreeValue * Math.PI) / 180;
}

export const generateImage = async (imageSrc, croppedAreaPixels, filterClass, customFilter) => {

    return new Promise((resolve, reject) => {

        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const scaleFactor = img.naturalWidth / img.width;
            canvas.width = croppedAreaPixels.width * scaleFactor;
            canvas.height = croppedAreaPixels.height * scaleFactor;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                img,
                croppedAreaPixels.x * scaleFactor,
                croppedAreaPixels.y * scaleFactor,
                croppedAreaPixels.width * scaleFactor,
                croppedAreaPixels.height * scaleFactor,
                0,
                0,
                croppedAreaPixels.width * scaleFactor,
                croppedAreaPixels.height * scaleFactor
            );

            if (filterClass) {
                const filter = document.createElement('div');
                filter.classList.add(filterClass);
                filter.style.width = `${canvas.width}px`;
                filter.style.height = `${canvas.height}px`;
                filter.style.position = 'absolute';
                filter.style.top = '0';
                filter.style.left = '0';
                const imgResultRef = document.createElement('img');
                imgResultRef.src = canvas.toDataURL('image/png');
                imgResultRef.style.width = `${canvas.width}px`;
                imgResultRef.style.height = `${canvas.height}px`;
                filter.appendChild(imgResultRef);
                document.body.appendChild(filter);
                html2canvas(filter).then((canvas) => {
                    filter.remove();
                    resolve(canvas);
                }).catch((error) => {
                    reject(error);
                });
            } else {
                resolve(canvas);
            }
        };

        img.onerror = (error) => {
            reject(error);
        };

    });

};


export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	
	const maxSize = Math.max(image.width, image.height);
	const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

	canvas.width = safeArea;
	canvas.height = safeArea;

	
	ctx.translate(safeArea / 2, safeArea / 2);
	ctx.rotate(getRadianAngle(rotation));
	ctx.translate(-safeArea / 2, -safeArea / 2);

	ctx.drawImage(
		image,
		safeArea / 2 - image.width * 0.5,
		safeArea / 2 - image.height * 0.5
	);

	const data = ctx.getImageData(0, 0, safeArea, safeArea);
		

	canvas.width = pixelCrop.width;
	canvas.height = pixelCrop.height;

	ctx.putImageData(
		data,
		0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
		0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
	);


	return canvas;

}

export const generateDownload = async (imageSrc, croppedAreaPixels, filterClass, customFilter) => {
	
	const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
        const scaleFactor = img.naturalWidth / img.width;
        canvas.width = croppedAreaPixels.width * scaleFactor;
        canvas.height = croppedAreaPixels.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            img,
            croppedAreaPixels.x * scaleFactor,
            croppedAreaPixels.y * scaleFactor,
            croppedAreaPixels.width * scaleFactor,
            croppedAreaPixels.height * scaleFactor,
            0,
            0,
            croppedAreaPixels.width * scaleFactor,
            croppedAreaPixels.height * scaleFactor
        );

        if (filterClass) {
            const filter = document.createElement('div');
            filter.classList.add(filterClass);
            filter.style.width = `${canvas.width}px`;
            filter.style.height = `${canvas.height}px`;
            filter.style.position = 'absolute';
            filter.style.top = '0';
            filter.style.left = '0';
            const imgResultRef = document.createElement('img');
            imgResultRef.src = canvas.toDataURL('image/png');
            imgResultRef.style.width = `${canvas.width}px`;
            imgResultRef.style.height = `${canvas.height}px`;
            filter.appendChild(imgResultRef);
            document.body.appendChild(filter);
            html2canvas(filter).then((canvas) => {
                const link = document.createElement('a');
                link.download = 'edited-image.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                filter.remove();
            });
        } else {
            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };
};

export const croppedImg = async (imageSrc, croppedAreaPixels, filterClass, customFilter) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const scaleFactor = img.naturalWidth / img.width;
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width * scaleFactor;
        canvas.height = croppedAreaPixels.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img,
          croppedAreaPixels.x * scaleFactor,
          croppedAreaPixels.y * scaleFactor,
          croppedAreaPixels.width * scaleFactor,
          croppedAreaPixels.height * scaleFactor,
          0,
          0,
          croppedAreaPixels.width * scaleFactor,
          croppedAreaPixels.height * scaleFactor
        );
  
        if (filterClass) {
          const filter = document.createElement('div');
          filter.classList.add(filterClass);
          filter.style.width = `${canvas.width}px`;
          filter.style.height = `${canvas.height}px`;
          filter.style.position = 'absolute';
          filter.style.top = '0';
          filter.style.left = '0';
          const imgResultRef = new Image();
          imgResultRef.onload = () => {
            filter.appendChild(imgResultRef);
            document.body.appendChild(filter);
            html2canvas(filter).then((canvas) => {
              filter.remove();
              resolve(canvas);
            }).catch((error) => {
              reject(error);
            });
          };
          imgResultRef.onerror = (error) => {
            reject(error);
          };
          imgResultRef.src = canvas.toDataURL('image/png');
        } else {
          resolve(canvas);
        }
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = imageSrc;
    });
  };
  
  