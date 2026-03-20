window.HELP_IMPROVE_VIDEOJS = false;

// ------------ VTO Demo ------------ 
const tripletData = [
  { label: "XS Person, 3XL Garment" }, // Example #1
  { label: "L Person, XS Garment" }, // Example #7
  { label: "2XL Person, 2XL Garment" }, // Example #3
  { label: "M Person, 2XL Garment" }, // Example #11
  { label: "S Person, S Garment" }, // Example #10
  { label: "3XL Person, 3XL Garment" }, // Example #14
  { label: "M Person, XL Garment" }, // Example #4
  { label: "3XL Person, XL Garment" }, // Example #9
  { label: "S Person, S Garment" }, // Example #6
  { label: "M Person, 2XL Garment" }, // Example #12
  { label: "XS Person, L Garment" }, // Example #5
  { label: "M Person, M Garment" }, // Example #2
  { label: "XL Person, S Garment" }, // Example #13
  { label: "S Person, S Garment" }, // Example #8
  { label: "XL Person, S Garment" }, // Example #15
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

// ------------ Old VTO Demo ------------ 
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

let currentGarment2 = 'xs';
let currentSize = "s"; // Start with a string that matches sizeMap[2]

// 2. The Main Initialization
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('size-slider');
  
  if (slider) {
    slider.addEventListener('input', function(e) {
      let val = parseInt(e.target.value);
      const validSizes = [1,2,3,4,5,6,7];

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
  const validSizes = [1,2,3,4,5,6,7];

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
  1: { bust: "84", height: "160", hips: "93", waist: "64", width: "106", length: "46",  sleeve: "18" }, // 
  2: { bust: "113", height: "181", hips: "106", waist: "105", width: "100", length: "47",  sleeve: "14" }, // 2XL, S
  3: { bust: "141", height: "172", hips: "134", waist: "141", width: "130", length: "52",  sleeve: "0" }, // 3XL, 2XL
  4: { bust: "90", height: "163", hips: "87", waist: "74", width: "99", length: "61",  sleeve: "14" }, // XS, XS
  5: { bust: "118", height: "170", hips: "120", waist: "108", width: "119", length: "49",  sleeve: "18" }, // 2XL, XL
  6: { bust: "131", height: "190", hips: "121", waist: "127", width: "138", length: "61",  sleeve: "20" }, // 2XL, L
  7: { bust: "90", height: "175", hips: "93", waist: "72", width: "114", length: "50",  sleeve: "54" }, // XS, XS
  8: { bust: "95", height: "173", hips: "99", waist: "78", width: "99", length: "51",  sleeve: "30" }, // M, M
  9: { bust: "117", height: "170", hips: "123", waist: "106", width: "105", length: "68",  sleeve: "13" }, // 2XL, L
  10: { bust: "84", height: "174", hips: "100", waist: "63", width: "126", length: "59",  sleeve: "19" }, // XS, L
  11: { bust: "106", height: "175", hips: "109", waist: "91", width: "113", length: "60",  sleeve: "13" }, // L, L
  12: { bust: "114", height: "171", hips: "121", waist: "102", width: "119", length: "41",  sleeve: "58" }, // 2XL, 2XL
  13: { bust: "83", height: "170", hips: "95", waist: "63", width: "107", length: "49",  sleeve: "54" }, // XS, M
  14: { bust: "96", height: "154", hips: "99", waist: "80", width: "98", length: "62",  sleeve: "19" }, // M, M
  15: { bust: "118", height: "183", hips: "124", waist: "109", width: "124", length: "54",  sleeve: "59" }, // 2XL, 2XL
  16: { bust: "", height: "", hips: "", waist: "", width: "", length: "",  sleeve: "" }, // 
  17: { bust: "102", height: "182", hips: "108", waist: "86", width: "129", length: "53",  sleeve: "21" }, // M, XL
  18: { bust: "122", height: "152", hips: "133", waist: "108", width: "143", length: "48",  sleeve: "0" }, // 3XL, 3XL
  19: { bust: "90", height: "163", hips: "96", waist: "73", width: "107", length: "58",  sleeve: "42" }, // XS, M
  20: { bust: "108", height: "174", hips: "110", waist: "96", width: "125", length: "76",  sleeve: "17" }, // L, 2XL
  21: { bust: "123", height: "196", hips: "126", waist: "114", width: "157", length: "60",  sleeve: "41" }, // 2XL, 3XL
  22: { bust: "88", height: "165", hips: "96", waist: "68", width: "99", length: "70",  sleeve: "19" }, // S, 2XL
  23: { bust: "96", height: "154", hips: "99", waist: "80", width: "128", length: "58",  sleeve: "27" }, // S, 2XL
  24: { bust: "109", height: "158", hips: "114", waist: "97", width: "130", length: "56",  sleeve: "19" }, // XL, 2XL
};
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('dataset-grid');
  
  // Update these to match your actual folder and file count
  const totalImages = 24; 
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
          <div class="measure-header">Person</div> <div class="measure-item"><strong>Height:</strong> ${data.height} cm</div>
          <div class="measure-item"><strong>Height:</strong> ${data.height} cm</div>
          <div class="measure-item"><strong>Bust:</strong> ${data.bust} cm</div>
          <div class="measure-item"><strong>Waist:</strong> ${data.waist} cm</div>
          <div class="measure-item"><strong>Hips:</strong> ${data.hips} cm</div>
          <div class="measure-header" style="padding-top:6px;">Garment</div> <div class="measure-item"><strong>Height:</strong> ${data.height} cm</div>
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
