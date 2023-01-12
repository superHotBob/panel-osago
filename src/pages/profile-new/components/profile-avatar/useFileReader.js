import { useEffect, useRef, useState } from 'react';
import { noop } from 'utils';

export const IMG_MIME_TYPES = 'image/jpeg, image/jpg, image/gif, image/png';
export const IMAGE_MAX_SIZE = 10e6;
export const FILE_MIN_PROPORTIONS = 320;
export const FILE_MAX_PROPORTIONS = 5000;

function imageFileValidation(file) {
  if (!file) {
    return { message: 'File error' };
  }

  if (!IMG_MIME_TYPES.includes(file.type)) {
    return {
      message: `Invalid file type`,
    };
  }

  if (file.size > IMAGE_MAX_SIZE) {
    return {
      message: `Photo size should be not more than ${IMAGE_MAX_SIZE / 10e5}MB`,
    };
  }
}

function imageSizeValidation(image, min = true, max = true) {
  if (min && (image.width < FILE_MIN_PROPORTIONS || image.height < FILE_MIN_PROPORTIONS)) {
    return {
      message: 'Your photo is too small!',
    };
  }

  if (max && (image.width > FILE_MAX_PROPORTIONS || image.height > FILE_MAX_PROPORTIONS)) {
    return {
      message: 'Your photo is too big!',
    };
  }
}

export function useFileReader(name) {
  const input = useRef(null);
  const container = useRef(null);
  const imageView = useRef(null);
  const errorElem = useRef(null);
  const label = useRef(null);
  const closeBlock = useRef(null);
  const [fileIsUploaded, setFileIsUploaded] = useState(false);

  const uploadPhoto = imageFile => {
    const reader = new FileReader();

    reader.onload = () => {
      const fileHasError = imageFileValidation(imageFile);
      console.log('fileHasError: ', fileHasError);

      if (fileHasError) {
        return;
      }

      const img = new Image(imageFile.width, imageFile.height);
      img.src = reader.result;
      img.onload = () => {
        setFileIsUploaded(false);
        const photoSizeError = imageSizeValidation(img, true, false);
        console.log('photoSizeError: ', photoSizeError);

        if (photoSizeError) {
          return;
        }

        if (imageView.current && container.current) {
          console.log('imageView.current && container.current: ', imageView.current && container.current);
          imageView.current.setAttribute('data-status', 'visible');
          imageView.current.style.backgroundImage = `url(${img.src})`;
          container.current.setAttribute('data-status', 'uploaded');
          label.current.setAttribute('data-status', 'uploaded');
          closeBlock.current && closeBlock.current.setAttribute('data-status', 'visible');
          setFileIsUploaded(true);
        }
      };
    };

    reader.onerror = error => console.error(error);

    imageFile && reader.readAsDataURL(imageFile);
  };

  const onSelectFile = ({ target }) => {
    const imageFile = target.files[0];
    uploadPhoto(imageFile);
  };

  const handleFocusBack = () => {
    window.removeEventListener('focus', handleFocusBack);
  };

  useEffect(() => {
    input.current.addEventListener('change', onSelectFile);

    input.current.modularFormAPI = {
      emitError: msg => {
        inputEventEmitter.emitError(input.current, name, msg);
      },
    };

    label.current.addEventListener('input.error', function(e) {
      this.setAttribute('data-input-error', 'true');
      this.setAttribute('data-status', 'error');
      errorElem.current.innerHTML = e.detail.msg;
    });

    label.current.addEventListener('click', function(e) {
      this.setAttribute('data-input-error', 'false');
      this.setAttribute('data-status', '');

      window.addEventListener('focus', handleFocusBack);
    });

    closeBlock.current &&
      closeBlock.current.addEventListener('click', () => {
        imageView.current.setAttribute('data-status', 'hidden');
        imageView.current.style.backgroundImage = ``;
        label.current.setAttribute('data-status', 'empty');
        container.current.removeAttribute('data-status');
        closeBlock.current.setAttribute('data-status', 'hidden');
        setFileIsUploaded(false);
      });
  }, []);

  return { fileIsUploaded, uploadPhoto, input, imageView, errorElem, label, closeBlock, container };
}
