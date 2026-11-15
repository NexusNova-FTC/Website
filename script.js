const createSlideshow = (slideshow) => {
  const caption = slideshow.querySelector('.slide-caption');
  const images = slideshow.dataset.images
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean);

  if (images.length < 2) {
    return null;
  }

  let stage = slideshow.querySelector('.slide-stage');
  if (!stage) {
    const existingImage = slideshow.querySelector('.slide-image');
    stage = document.createElement('div');
    stage.className = 'slide-stage';
    if (existingImage) {
      stage.appendChild(existingImage);
    }
    slideshow.appendChild(stage);
  }

  const imageList = Array.from(stage.querySelectorAll('.slide-image'));
  imageList.forEach((image) => image.remove());

  const firstImage = document.createElement('img');
  firstImage.className = 'slide-image is-active';
  firstImage.src = images[0];
  firstImage.alt = 'Slideshow image';
  firstImage.style.opacity = '1';
  firstImage.style.transform = 'translateX(0)';

  const secondImage = document.createElement('img');
  secondImage.className = 'slide-image is-next';
  secondImage.src = images[1];
  secondImage.alt = 'Slideshow image';
  secondImage.style.opacity = '0';
  secondImage.style.transform = 'translateX(100%)';

  stage.appendChild(firstImage);
  stage.appendChild(secondImage);

  let currentIndex = 0;
  let currentImage = firstImage;
  let nextImage = secondImage;
  let intervalId = null;
  let transitionId = null;

  const clearTimers = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (transitionId) {
      clearTimeout(transitionId);
      transitionId = null;
    }
  };

  const reset = () => {
    currentIndex = 0;
    currentImage = firstImage;
    nextImage = secondImage;

    firstImage.src = images[0];
    secondImage.src = images[1];

    firstImage.className = 'slide-image is-active';
    secondImage.className = 'slide-image is-next';

    firstImage.style.opacity = '1';
    firstImage.style.transform = 'translateX(0)';
    secondImage.style.opacity = '0';
    secondImage.style.transform = 'translateX(100%)';

    if (caption) {
      caption.textContent = 'Nexus Nova highlight 1';
    }
  };

  const advance = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    const outgoing = currentImage;
    const incoming = nextImage;

    incoming.src = images[nextIndex];
    incoming.className = 'slide-image is-next';
    incoming.style.opacity = '0';
    incoming.style.transform = 'translateX(100%)';

    requestAnimationFrame(() => {
      outgoing.classList.remove('is-active');
      outgoing.classList.add('is-exit');
      outgoing.style.opacity = '1';
      outgoing.style.transform = 'translateX(-100%)';

      incoming.classList.remove('is-next');
      incoming.classList.add('is-active');
      incoming.style.opacity = '1';
      incoming.style.transform = 'translateX(0)';
    });

    transitionId = setTimeout(() => {
      currentIndex = nextIndex;
      currentImage = incoming;
      nextImage = outgoing;

      currentImage.classList.remove('is-next', 'is-exit');
      currentImage.classList.add('is-active');
      currentImage.style.opacity = '1';
      currentImage.style.transform = 'translateX(0)';

      nextImage.classList.remove('is-active', 'is-exit');
      nextImage.classList.add('is-next');
      nextImage.style.opacity = '0';
      nextImage.style.transform = 'translateX(100%)';

      if (caption) {
        caption.textContent = `Nexus Nova highlight ${currentIndex + 1}`;
      }
    }, 1400);
  };

  const start = () => {
    clearTimers();
    reset();
    intervalId = setInterval(advance, 4000);
  };

  reset();
  return { start, clearTimers };
};

const applySlideshowState = () => {
  document.querySelectorAll('.slideshow').forEach((slideshow) => {
    const state = createSlideshow(slideshow);
    if (!state) {
      return;
    }

    slideshow.__slideState = state;
    state.start();
  });
};

const createStarField = () => {
  const starField = document.createElement('div');
  starField.className = 'background-stars';
  starField.setAttribute('aria-hidden', 'true');
  starField.style.setProperty('--pointer-x', '0px');
  starField.style.setProperty('--pointer-y', '0px');

  for (let starIndex = 0; starIndex < 180; starIndex += 1) {
    const star = document.createElement('span');
    const size = (Math.random() * 2 + 1).toFixed(2);
    const duration = (Math.random() * 7 + 6).toFixed(2);
    const delay = (Math.random() * -12).toFixed(2);
    const brightness = (Math.random() * 0.45 + 0.55).toFixed(2);
    const depth = (Math.random() * 0.9 + 0.2).toFixed(2);

    star.className = 'background-star';
    star.style.setProperty('--top', `${(Math.random() * 100).toFixed(2)}%`);
    star.style.setProperty('--left', `${(Math.random() * 100).toFixed(2)}%`);
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    star.style.setProperty('--brightness', brightness);
    star.style.setProperty('--depth', depth);
    starField.appendChild(star);
  }

  document.body.appendChild(starField);

  window.addEventListener('pointermove', (event) => {
    const horizontalOffset = ((event.clientX / window.innerWidth) - 0.5) * -18;
    const verticalOffset = ((event.clientY / window.innerHeight) - 0.5) * -18;
    starField.style.setProperty('--pointer-x', `${horizontalOffset.toFixed(2)}px`);
    starField.style.setProperty('--pointer-y', `${verticalOffset.toFixed(2)}px`);
  });

  window.addEventListener('pointerleave', () => {
    starField.style.setProperty('--pointer-x', '0px');
    starField.style.setProperty('--pointer-y', '0px');
  });
};

const resetTabScroll = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

applySlideshowState();

document.querySelectorAll('.tabs label').forEach((label) => {
  label.addEventListener('click', () => {
    resetTabScroll();
    setTimeout(resetTabScroll, 20);
  });
});

document.querySelectorAll('input[name="tabs"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    resetTabScroll();

    document.querySelectorAll('.slideshow').forEach((slideshow) => {
      const state = slideshow.__slideState;
      if (!state) {
        return;
      }

      const tabContent = slideshow.closest('.tab-content');
      const isVisible = !!tabContent && window.getComputedStyle(tabContent).display !== 'none';

      if (isVisible) {
        state.start();
      } else {
        state.clearTimers();
      }
    });
  });
});

createStarField();
