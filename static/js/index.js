window.HELP_IMPROVE_VIDEOJS = false;

// ------------ VTO Demo ------------ 
const tripletData = [
  { label: "XS Person, 3XL Garment" }, // Example #1
  { label: "2XL Person, 2XL Garment" }, // Example #3
  { label: "M Person, XL Garment" }, // Example #4
  { label: "XS Person, L Garment" }, // Example #5
];

let currentTriplet = 0;

function moveTriplet(direction) {
  const track = document.getElementById('triplet-track');
  const label = document.getElementById('triplet-label');
  const total = tripletData.length;

  currentTriplet = (currentTriplet + direction + total) % total;

  // Moves the track by exactly one full viewport width
  track.style.transform = `translateX(-${currentTriplet * 100}%)`;
  
  // Update the text label
  if(label) {
    label.innerText = tripletData[currentTriplet].label;
  }
}

// ------------ End VTO Demo ------------ 

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
  1: { bust: "114", height: "171", hips: "121", waist: "102", width: "119", length: "50",  sleeve: "18" },
  2: { bust: "90", height: "165", hips: "88", waist: "75", width: "101", length: "49",  sleeve: "18" },
  3: { bust: "101", height: "178", hips: "104", waist: "86", width: "120", length: "75",  sleeve: "30" },
  4: { bust: "117", height: "176", hips: "117", waist: "105", width: "131", length: "53",  sleeve: "0" },
  5: { bust: "95", height: "172", hips: "100", waist: "77", width: "142", length: "53",  sleeve: "54" },
  6: { bust: "123", height: "195", hips: "126", waist: "114", width: "114", length: "50",  sleeve: "16" },
  7: { bust: "84", height: "163", hips: "90", waist: "63", width: "92", length: "45",  sleeve: "21" },
  8: { bust: "141", height: "172", hips: "134", waist: "141", width: "134", length: "50",  sleeve: "48" },
  9: { bust: "86", height: "162", hips: "89", waist: "68", width: "142", length: "58",  sleeve: "23" },
  10: { bust: "94", height: "161", hips: "93", waist: "78", width: "104", length: "55",  sleeve: "20" },
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
let totalSlides = 5

function moveSlider(direction) {
    const track = document.getElementById('comparison-track');
    
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

// ------------ SOTA Comparison #2 -------
let currentSota2 = 0;

function moveSota2(direction) {
  const track = document.getElementById('sota-track-2');
  const items = track.querySelectorAll('.comparison-set');
  const total = items.length;

  currentSota2 = (currentSota2 + direction + total) % total;

  track.style.transform = `translateX(-${currentSota2 * 100}%)`;
}
// ------------ End SOTA Comparison #2 -------

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
