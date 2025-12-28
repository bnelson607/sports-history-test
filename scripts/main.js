// Load main page header HTML dynamically
fetch('/sports-history-simulations/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('site-header').innerHTML = data;
    });

// Load main page footer HTML dynamically
fetch('/sports-history-simulations/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('site-footer').innerHTML = data;
    });

// Load USA header HTML dynamically
fetch('/sports-history-simulations/usa/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('usa-header').innerHTML = data;
    });

// Load UEFA header HTML dynamically
fetch('/sports-history-simulations/uefa/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('uefa-header').innerHTML = data;
    });

// Tab switching function
function showTab(group, tabId) {
    const tabElement = document.getElementById(tabId);
    if (!tabElement) return;

    const container = tabElement.closest('details');
    if (!container) return;

    const tabs = container.querySelectorAll('.tab-content.' + group);
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.id === tabId);
    });

    const buttons = container.querySelectorAll('.tab-buttons button');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(tabId));
    });
}

// Resize iframe contents to fit
// function resizeIframes() {
//     const iframes = document.querySelectorAll('iframe');
//     iframes.forEach(iframe => {
//         try {
//             const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//             if (iframeDocument) {
//                 const height = Math.max(
//                     iframeDocument.body.scrollHeight,
//                     iframeDocument.documentElement.scrollHeight
//                 );
//                 const extra_1 = iframe.classList.contains('extra-padding') ? 15 : 0;
//                 const extra_2 = iframe.classList.contains('double-extra-padding') ? 30 : 0;
//                 iframe.style.height = (height + extra_1 + extra_2) + 'px';
//             }
//         } catch (e) {
//             console.warn('Cannot access iframe content to resize:', iframe.src);
//         }
//     });
// }

// function resizeIframes() {
//     const iframes = document.querySelectorAll('iframe');
//     iframes.forEach(iframe => {
//         try {
//             // Wait 100ms to let content stabilize before measuring
//             setTimeout(() => {
//                 const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
//                 if (iframeDocument) {
//                     const height = Math.max(
//                         iframeDocument.body.scrollHeight,
//                         iframeDocument.documentElement.scrollHeight
//                     );
//                     const extra_1 = iframe.classList.contains('extra-padding') ? 15 : 0;
//                     const extra_2 = iframe.classList.contains('double-extra-padding') ? 30 : 0;
//                     iframe.style.height = (height + extra_1 + extra_2) + 'px';
//                 }
//             }, 200);
//         } catch (e) {
//             console.warn('Cannot access iframe content to resize:', iframe.src);
//         }
//     });
// }


function resizeIframe(iframe) {
    try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDocument) return;

        const body = iframeDocument.body;
        const html = iframeDocument.documentElement;

        // Only proceed if both exist
        if (!body || !html) return;

        const contentHeight = Math.max(
            body.scrollHeight || 0,
            body.offsetHeight || 0,
            html.clientHeight || 0,
            html.scrollHeight || 0,
            html.offsetHeight || 0
        );

        const extra_1 = iframe.classList.contains('extra-padding') ? 15 : 0;
        const extra_2 = iframe.classList.contains('double-extra-padding') ? 30 : 0;

        iframe.style.height = (contentHeight + extra_1 + extra_2) + 'px';
    } catch (e) {
        console.warn('Resize failed:', e);
    }
}

function attachIframeListeners() {
    const iframes = document.querySelectorAll('iframe');

    iframes.forEach(iframe => {
        // 1. Add a 'load' listener to resize after load
        iframe.addEventListener('load', () => {
            // Small delay to allow rendering
            setTimeout(() => resizeIframe(iframe), 100);
        });

        // 2. If it's already loaded, resize immediately
        if (iframe.contentDocument?.readyState === 'complete') {
            setTimeout(() => resizeIframe(iframe), 100);
        }
    });
}

window.addEventListener('load', attachIframeListeners);


// Add listeners to resize iframes on load
// window.addEventListener('load', () => {
//     resizeIframes();
//     document.querySelectorAll('iframe').forEach(iframe => {
//         iframe.addEventListener('load', resizeIframes);
//     });
// });

function lazyLoadIframes() {
  // Select all <details> elements
  const detailsElements = document.querySelectorAll('details');

  detailsElements.forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        // When details is opened, find all iframes inside
        const iframes = details.querySelectorAll('iframe');

        iframes.forEach(iframe => {
          // Only set src if it’s not already set (prevents reloading)
          if (!iframe.src) {
            const dataSrc = iframe.getAttribute('data-src');
            if (dataSrc) {
              iframe.src = dataSrc;
            }
          }
        });
      }
    });
  });
}

// Run this on page load
window.addEventListener('load', () => {
  lazyLoadIframes();

  // Also attach your existing iframe resize listeners here
  attachIframeListeners();
});


document.addEventListener("DOMContentLoaded", function() {
    const dateSpan = document.getElementById('update-date');
    if (!dateSpan) return;

    // Fetch the JSON file in the same directory as the HTML
    fetch("sim_date.json")
        .then(response => response.json())
        .then(data => {
            dateSpan.textContent = data.simulation_date;
        })
        .catch(err => {
            console.error("Failed to load simulation date:", err);
        });
});
