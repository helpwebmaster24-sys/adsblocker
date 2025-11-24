<script>
  (function () {
    function detectAdBlock() {
        return new Promise((resolve) => {
            let bait = document.createElement("div");
            bait.className = "adsbox ad-banner ad-unit"; 
            bait.style.width = "1px";
            bait.style.height = "1px";
            bait.style.position = "absolute";
            bait.style.left = "-9999px";
            bait.style.visibility = "hidden";
            document.body.appendChild(bait);

            setTimeout(() => {
                let isBlocked = !bait || bait.offsetParent === null || window.getComputedStyle(bait).display === "none";
                document.body.removeChild(bait);
                resolve(isBlocked);
            }, 100);
        });
    }

    function detectVPN() {
        return fetch('https://www.iplocate.io/api/lookup/?apikey=279468deb812e96ceb3e843bb60fe2ca') // Change YOUR_API_KEY
          .then(response => response.json())
          .then(data => data.privacy && data.privacy.is_vpn)
          .catch(() => false);
    }

    function showBlockPopup(message) {
        let overlay = document.createElement("div");
        overlay.id = "block-overlay";
        Object.assign(overlay.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: "9999",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        });

        overlay.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 30px 40px;
              text-align: center;
              max-width: 480px;
              border-radius: 16px;
              background: linear-gradient(135deg, #ff6b6b, #f94d6a);
              color: white;
              box-shadow: 0 10px 30px rgba(249, 77, 106, 0.6);
              font-size: 1.3em;
              font-weight: 600;
              letter-spacing: 0.02em;
            ">
                <h2 style="margin: 0 0 20px 0; font-weight: 800; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">${message.title}</h2>
                <p style="margin-bottom: 25px; line-height: 1.5em;">${message.text}</p>
                <button id="refresh-page" style="
                  padding: 12px 28px;
                  font-size: 1.1rem;
                  font-weight: 700;
                  background: white;
                  color: #f94d6a;
                  border: none;
                  border-radius: 12px;
                  box-shadow: 0 5px 15px rgba(249, 77, 106, 0.5);
                  cursor: pointer;
                  transition: background-color 0.3s ease, color 0.3s ease;
                ">Reload Page</button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById("refresh-page").addEventListener("click", function () {
            location.reload();
        });
    }

    window.addEventListener("load", () => {
        Promise.all([detectAdBlock(), detectVPN()]).then(results => {
            const [adBlockDetected, vpnDetected] = results;
            if (adBlockDetected) {
                showBlockPopup({
                  title: "AdBlocker DETECTED!",
                  text: " আপনি অ্যাড ব্লকার ব্যবহার করছেন পরবর্তী এক মিনিটের মধ্যে আপনি যদি অ্যাড ব্লকার না বন্ধ করেন তাহলে আপনার অ্যাকাউন্ট পরবর্তী 24 ঘন্টার মধ্যে আমাদের সিস্টেম থেকে মুছে ফেলা হবে। "
                });
            } else if (vpnDetected) {
                showBlockPopup({
                  title: "VPN DETECTED!",
                  text: " আপনি VPN ব্যবহার করছেন পরবর্তী এক মিনিটের মধ্যে আপনি যদি VPN না বন্ধ করেন তাহলে আপনার অ্যাকাউন্ট পরবর্তী 24 ঘন্টার মধ্যে আমাদের সিস্টেম থেকে মুছে ফেলা হবে। "
                });
            }
        });
    });
  })();
</script>
