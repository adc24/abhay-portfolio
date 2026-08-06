# Abhay Chouhan — Developer Portfolio

A responsive, cinematic single-page portfolio for **Abhay Chouhan** — Full Stack Developer, Data Analyst, and AI-Assisted Developer.

The site is built with **HTML5, CSS3, and vanilla JavaScript only**. It does not require React, npm, Node.js, Bootstrap, Tailwind CSS, or any frontend framework.

## Features

- Fullscreen looping video hero
- Responsive desktop, tablet, and mobile layouts
- Seven real portfolio projects with verified GitHub links
- Skills, experience, education, and contact sections
- Accessible mobile navigation and keyboard focus states
- Scroll-reveal motion with reduced-motion support
- In-page two-page résumé viewer
- Downloadable PDF résumé
- Contact form delivery through FormSubmit
- GitHub and LinkedIn profile links
- Local Python development server

## Requirements

### To run the website

- Python 3.8 or newer
- A modern browser such as Chrome, Edge, Firefox, or Safari
- Internet access for:
  - The CloudFront background video
  - Google Fonts
  - GitHub and LinkedIn links
  - Contact-form delivery through FormSubmit

There are **no third-party runtime packages**. You do not need to run `npm install`.

## Quick start

### Windows

Double-click:

```text
start.bat
```

Or open Command Prompt in the project folder and run:

```bash
py -3 server.py
```

If the Python launcher is unavailable:

```bash
python server.py
```

### macOS or Linux

Open Terminal in the project folder and run:

```bash
chmod +x start.sh
./start.sh
```

Or run directly:

```bash
python3 server.py
```

Then open:

```text
http://localhost:4173
```

Stop the server with `Ctrl + C`.

> Use the local server instead of opening `index.html` directly. Browser security restrictions on `file://` pages can interfere with résumé downloads and JavaScript requests.

## Alternative local server

You can also use Python's built-in server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Project structure

```text
Abhay_Chouhan_Portfolio/
├── index.html                         # Website markup and portfolio content
├── style.css                          # Responsive design and animations
├── script.js                          # Navigation, résumé, form, and UI behavior
├── server.py                          # Zero-dependency local development server
├── start.sh                           # macOS/Linux launcher
├── start.bat                          # Windows launcher
├── requirements.txt                   # Runtime dependency information
├── requirements-dev.txt               # Optional résumé-rendering dependency
├── site.webmanifest                   # Web app metadata
├── robots.txt                         # Search crawler rules
├── LICENSE                            # MIT license
├── README.md                          # Complete setup and customization guide
├── README_FIRST.txt                   # Short local-run instructions
├── CHECKSUMS.sha256                   # File integrity checksums
├── assets/
│   ├── Abhay_Chouhan_Resume.pdf       # Original downloadable résumé
│   ├── resume-page-1.png              # Browser-safe résumé preview page 1
│   ├── resume-page-2.png              # Browser-safe résumé preview page 2
│   └── favicon.svg                    # Site icon
└── tools/
    └── render_resume.py               # Regenerates résumé preview images
```

## Contact-form activation

The contact form is configured to deliver messages to:

```text
abhaydinakar246@gmail.com
```

Because this is a static website without a private backend, it uses [FormSubmit](https://formsubmit.co/).

### Required one-time activation

1. Start the site locally or deploy it.
2. Submit the contact form once.
3. Open `abhaydinakar246@gmail.com`.
4. Check both Inbox and Spam for an email from FormSubmit.
5. Click **Activate Form**.
6. Submit another test message.

After activation, new form submissions are delivered to the Gmail inbox. The sender's email is included as the reply-to address.

The form includes validation, a spam honeypot, disabled/loading state, success feedback, and error feedback. If FormSubmit is unavailable, the page displays the direct email address as a fallback.

## Résumé viewer and download

The project contains the original PDF and two PNG previews. The previews allow the résumé to be viewed inside browsers and embedded preview environments that block PDF plugins.

- **View Resume** opens the local in-page viewer.
- **Download résumé** downloads `Abhay_Chouhan_Resume.pdf`.

### Replace the résumé later

1. Replace:

```text
assets/Abhay_Chouhan_Resume.pdf
```

2. Install the optional development dependency:

```bash
python3 -m pip install -r requirements-dev.txt
```

3. Regenerate the browser preview pages:

```bash
python3 tools/render_resume.py
```

The script automatically renders every PDF page at high resolution and removes stale preview images.

## Customize the portfolio

### Personal details and links

Edit `index.html` and search for:

```text
Abhay Chouhan
abhaydinakar246@gmail.com
github.com/adc24
linkedin.com/in/abhay-chouhan-563126313
```

If you change the contact email, replace it in both `index.html` and the error fallback text in `script.js`.

### Projects

Project entries are inside the `#projects` section of `index.html`. Each project contains:

- Project category
- Title
- Description
- Technology tags
- GitHub/live links

### Colors

Edit the CSS variables at the beginning of `style.css`:

```css
:root {
  --background: hsl(201, 100%, 13%);
  --foreground: hsl(0, 0%, 100%);
  --section-background: hsl(201, 100%, 8%);
  --section-background-alt: hsl(196, 70%, 10%);
  --ice: hsl(188, 34%, 82%);
}
```

### Background video

The video URL is in the `<video>` element near the beginning of `index.html`. Replace the `<source src="...">` URL to use another MP4.

## Deploying

This is a static website. Upload the project files to any static host.

### GitHub Pages

1. Create a GitHub repository.
2. Push the project files.
3. Open **Settings → Pages**.
4. Select the branch and root folder.
5. Save and wait for the Pages URL.

### Vercel

1. Import the GitHub repository into Vercel.
2. Choose **Other** or a static-site configuration.
3. Leave the build command empty.
4. Set the output directory to the project root (`.`) if requested.
5. Deploy.

### Netlify

Drag the extracted project folder into Netlify Drop, or connect its GitHub repository. No build command is required.

> `server.py` is only for local development. Static hosts serve `index.html` directly.

## Troubleshooting

### The video is not visible

Confirm that the device is online and the CloudFront MP4 URL is accessible. If it cannot load, the deep-blue background color remains visible.

### GitHub or LinkedIn does not open inside an embedded preview

Some website builders sandbox external navigation. Run the project locally at `http://localhost:4173` or open the deployed website directly in a browser. The links use top-level navigation to avoid popup blockers.

### Résumé does not display

The in-page viewer uses local PNG files and does not require a PDF browser plugin. Confirm these files exist:

```text
assets/resume-page-1.png
assets/resume-page-2.png
```

### Contact messages are not arriving

Complete the one-time FormSubmit activation and check the Gmail Spam folder. Form delivery also requires an internet connection.

### Port 4173 is already in use

macOS/Linux:

```bash
PORT=8080 python3 server.py
```

Windows PowerShell:

```powershell
$env:PORT=8080
python server.py
```

Then open `http://localhost:8080`.

## License

Released under the MIT License. See [LICENSE](LICENSE).
