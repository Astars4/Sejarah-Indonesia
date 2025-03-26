document.addEventListener("DOMContentLoaded", function () {
  const timelineItems = document.querySelectorAll(".timeline li");
  const timelineWrapper = document.querySelector(".timeline-wrapper");
  const timeline = document.querySelector(".timeline");

  let currentPosition = 0;
  let activeItem = null;
  let isDragging = false;
  let startX;
  let startPosition;
  let lastTap = 0;
  const tapDelay = 300; // milliseconds for double-tap detection

  // Initialize timeline
  function initTimeline() {
    if (timelineItems.length > 0) {
      setActiveItem(timelineItems[0]);
    }
    centerTimeline();
  }

  // Set active item
  function setActiveItem(item) {
    if (activeItem) {
      activeItem.classList.remove("active");
    }
    item.classList.add("active");
    activeItem = item;
    centerActiveItem();
  }

  // Center the active item in view
  function centerActiveItem() {
    if (!activeItem) return;
    const wrapperWidth = timelineWrapper.clientWidth;
    const itemOffset = activeItem.offsetLeft;
    const itemWidth = activeItem.clientWidth;

    currentPosition = -(itemOffset - wrapperWidth / 2 + itemWidth / 2);
    updateTimelinePosition();
  }

  // Center the timeline on load
  function centerTimeline() {
    const wrapperWidth = timelineWrapper.clientWidth;
    const timelineWidth = timeline.scrollWidth;

    currentPosition = -(timelineWidth - wrapperWidth) / 2;
    updateTimelinePosition();
  }

  // Update timeline position
  function updateTimelinePosition() {
    const timelineWidth = timeline.scrollWidth;
    const wrapperWidth = timelineWrapper.clientWidth;

    const maxPosition = 0;
    const minPosition = -(timelineWidth - wrapperWidth);

    currentPosition = Math.min(
      maxPosition,
      Math.max(minPosition, currentPosition)
    );
    timeline.style.transform = `translateX(${currentPosition}px) translateY(-50%)`;
  }

  // Handle item click/tap
  function handleItemInteraction(item, e) {
    // For touch events, check if it's a significant drag
    if (e.type.includes("touch")) {
      const touch = e.changedTouches[0];
      const xPosition = touch.clientX;
      if (isDragging && Math.abs(xPosition - startX) > 15) {
        // Increased threshold
        return;
      }
    }

    // For mouse events
    if (e.type === "click") {
      const xPosition = e.clientX;
      if (isDragging && Math.abs(xPosition - startX) > 5) {
        return;
      }
    }

    // Handle the actual interaction
    if (item === activeItem) {
      const now = new Date().getTime();
      if (now - lastTap < tapDelay) {
        // Double-tap to close
        item.classList.remove("active");
        activeItem = null;
      }
      lastTap = now;
    } else {
      setActiveItem(item);
    }
  }

  // Event listeners for timeline items
  timelineItems.forEach((item) => {
    // Mouse events
    item.addEventListener("click", function (e) {
      handleItemInteraction(item, e);
    });

    // Touch events
    item.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
        // Prevent default to avoid scrolling but allow clicks
        if (e.touches.length === 1) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    item.addEventListener("touchend", function (e) {
      handleItemInteraction(item, e);
    });

    // Close button
    const closeBtn = item.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        item.classList.remove("active");
        activeItem = null;
      });

      // Add touch event for close button
      closeBtn.addEventListener("touchend", function (e) {
        e.stopPropagation();
        item.classList.remove("active");
        activeItem = null;
      });
    }
  });

  // Touch and mouse events for horizontal scrolling
  timelineWrapper.addEventListener("mousedown", startDrag);
  timelineWrapper.addEventListener("touchstart", startDrag, { passive: false });
  timelineWrapper.addEventListener("mousemove", drag);
  timelineWrapper.addEventListener("touchmove", drag, { passive: false });
  timelineWrapper.addEventListener("mouseup", endDrag);
  timelineWrapper.addEventListener("touchend", endDrag);
  timelineWrapper.addEventListener("mouseleave", endDrag);
  timelineWrapper.addEventListener("touchcancel", endDrag);

  function startDrag(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!clientX) return;

    isDragging = true;
    startX = clientX;
    startPosition = currentPosition;
    timelineWrapper.style.cursor = "grabbing";

    // Only prevent default for touch events if we're definitely dragging
    if (e.type === "touchstart") {
      e.preventDefault();
    }
  }

  function drag(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!clientX) return;

    const x = clientX;
    const dx = x - startX;
    currentPosition = startPosition + dx;
    updateTimelinePosition();

    // Prevent default to avoid page scroll
    if (e.type === "touchmove") {
      e.preventDefault();
    }
  }

  function endDrag() {
    isDragging = false;
    timelineWrapper.style.cursor = "grab";
  }

  // Initialize
  initTimeline();

  // Handle window resize
  window.addEventListener("resize", function () {
    centerTimeline();
    if (activeItem) {
      centerActiveItem();
    }
  });
});
