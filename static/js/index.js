window.HELP_IMPROVE_VIDEOJS = false;
// ------------ VTO Demo ------------ 
let currentGarment = 'xl';
let currentPerson = 'xs';

function updateDisplay() {
  const display = document.getElementById('result-image');
  // Logic: result_g1_p1.jpg, result_g2_p1.jpg, etc.
  display.src = `./static/images/vto/${currentGarment}_${currentPerson}.png`; //`./results/result_${currentGarment}_${currentPerson}.jpg`;
}

function selectGarment(id) {
  currentGarment = id;
  updateDisplay();
}

function selectPerson(id) {
  currentPerson = id;
  updateDisplay();
}
// ------------ End VTO Demo ------------ 

// ------------ Resizing Demo ------------ 
// 1. Configuration & State
const sizeMap = { 1: "xs", 2: "s", 3: "m", 4: "l", 5: "xl", 6: "2xl", 7: "3xl" };
const availability = {
  'xs': [1, 2, 3, 4], // XS, S, M, L
  'xl':  [3, 4, 5, 6], // M, L, XL, 2XL
};

let currentGarment2 = 'xs';
let currentSize = "s"; // Start with a string that matches sizeMap[2]

// 2. The Main Initialization
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('size-slider');
  
  if (slider) {
    slider.addEventListener('input', function(e) {
      let val = parseInt(e.target.value);
      const validSizes = availability[currentGarment2] || [1,2,3,4,5,6,7];

      // SNAP LOGIC: If the user slides to a restricted value, find the closest valid one
      if (!validSizes.includes(val)) {
        val = validSizes.reduce((prev, curr) => 
          Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
        );
        e.target.value = val; // Force the slider handle to the valid position
      }
      
      currentSize = sizeMap[val];
      updateSliderDemo();
    });
  }
  // This initializes the labels and snap logic for the default garment
  selectGarmentSlider(currentGarment2, null);
});

// 3. Update Function
function updateSliderDemo() {
  const img = document.getElementById('slider-result-image');
  if (img) {
    img.src = `static/images/resizing/${currentGarment2}_${currentSize}.png`;
  }
}

// 4. Garment Selection Handler
function selectGarmentSlider(id, element) {
  currentGarment2 = id;
  const validSizes = availability[id] || [1,2,3,4,5,6,7];

  // 1. Update text labels styling
  const spans = document.querySelectorAll('#size-settings span');
  spans.forEach(span => {
    const val = parseInt(span.getAttribute('data-value'));
    if (validSizes.includes(val)) {
      span.classList.remove('is-unavailable');
    } else {
      span.classList.add('is-unavailable');
    }
  });

  // 2. Snap logic
  const slider = document.getElementById('size-slider');
  let val = parseInt(slider.value);
  
  if (!validSizes.includes(val)) {
    // Find the closest valid number
    val = validSizes.reduce((prev, curr) => 
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
    slider.value = val;
  }
  
  // *** KEY ADDITION ***
  // Update the global size string based on the (potentially snapped) slider value
  currentSize = sizeMap[val];

  // 3. Highlight the selected garment thumbnail
  document.querySelectorAll('.garment-thumb').forEach(el => el.classList.remove('is-active'));
  if (element) {
    const thumbImg = element.querySelector('img');
    if (thumbImg) thumbImg.classList.add('is-active');
  }

  // Now update the result image with the new garment AND the correct size
  updateSliderDemo();
}

// ------------ End Resizing Demo ------------ 


// ------------ Browse Dataset ------------ 
const sampleData = {
  1: { height: "173", bust: "85", waist: "62", hips: "90", length: "70", width: "50", sleeve: "60" },
  2: { height: "165", bust: "80", waist: "60", hips: "85", length: "68", width: "48", sleeve: "58" },
};
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('dataset-grid');
  
  // Update these to match your actual folder and file count
  const totalImages = 32; 
  const path = 'static/images/dataset/';

  if (gridContainer) {
    for (let i = 1; i <= totalImages; i++) {
      const item = document.createElement('div');
      item.className = 'grid-item';
      
      // We use an anonymous function to call toggleExpand
      item.onclick = function() { toggleExpand(this); };

      // Read measurements
      const data = sampleData[i] || sampleData[1]; // Fallback to first if missing

      // Add person and triplet images to visualization
      item.innerHTML = `
        <img src="${path}img${i}.png" class="main-sample">

        <div class="extra-assets">
          <img src="${path}garment${i}.png" class="asset-img garment-asset" title="Garment" onerror="this.style.display='none'">
          <img src="${path}triplet${i}.png" class="asset-img triplet-asset" title="Triplet" onerror="this.style.display='none'">
        </div>

        <div class="measurements-list">
          <div class="measure-item"><strong>Height:</strong> ${data.height} cm</div>
          <div class="measure-item"><strong>Bust:</strong> ${data.bust} cm</div>
          <div class="measure-item"><strong>Waist:</strong> ${data.waist} cm</div>
          <div class="measure-item"><strong>Hips:</strong> ${data.hips} cm</div>
          <div class="measure-item"><strong>Length:</strong> ${data.length} cm</div>
          <div class="measure-item"><strong>Width:</strong> ${data.width} cm</div>
          <div class="measure-item"><strong>Sleeve:</strong> ${data.sleeve} cm</div>
        </div>

        <div class="item-overlay">
          <span class="is-size-7">Sample #${i}</span>
        </div>
      `;
            
      gridContainer.appendChild(item);
    }
  }
});

// Keep this outside the listener so it's globally available for the onclicks
function toggleExpand(element) {
    const isExpanded = element.classList.contains('is-expanded');
    const container = document.querySelector('.dataset-grid');
    
    // 1. Remove expanded state from all others
    document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.remove('is-expanded', 'expand-left');
    });

    if (!isExpanded) {
        // 2. Determine if we are on the right side of the viewport
        const rect = element.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;

        if (rect.left > viewportCenterX) {
            element.classList.add('expand-left');
        }

        element.classList.add('is-expanded');
        
        // 3. Smoothly scroll the expanded item into view if it's still cut off
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 350); // Match your CSS transition time
    }
}
// ------------ Browse Dataset ------------ 

// ------------ SOTA Comparison -----------
let currentSlide = 0;

function moveSlider(direction) {
    const track = document.getElementById('comparison-track');
    // Count how many 'comparison-set' groups you have
    const slides = document.querySelectorAll('.comparison-set');
    const totalSlides = slides.length;
    
    currentSlide += direction;

    // Loop logic
    if (currentSlide >= totalSlides) {
        currentSlide = 0; // Go back to the first
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1; // Go to the last
    }

    // IMPORTANT: Use negative currentSlide to pull the track to the left
    const offset = currentSlide * -100;
    track.style.transform = `translateX(${offset}%)`;
}
// ------------ End SOTA Comparison -------

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})
