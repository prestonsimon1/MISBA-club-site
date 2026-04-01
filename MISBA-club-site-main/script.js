/**
 * MISBA site behaviors — board/events/showcase render from data.js
 */
(function () {
  const data = window.MISBA_DATA || { board: [], events: [], showcase: [] };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function formatEventDate(iso) {
    const d = new Date(iso + "T12:00:00");
    if (Number.isNaN(d.getTime())) return { month: "—", day: "—", weekday: "" };
    return {
      month: monthNames[d.getMonth()],
      day: String(d.getDate()),
      weekday: weekdayNames[d.getDay()],
    };
  }

  function renderBoard() {
    const grid = document.getElementById("board-grid");
    if (!grid) return;
    grid.innerHTML = data.board
      .map(
        (m) => `
      <article class="board-card">
        <div class="board-img">
          <img src="${escapeHtml(m.photo)}" alt="${escapeHtml(m.name)}" width="120" height="120" loading="lazy">
        </div>
        <h3>${escapeHtml(m.name)}</h3>
        <p class="role">${escapeHtml(m.role)}</p>
        <div class="social-mini">
          ${
            m.linkedin
              ? `<a href="${escapeHtml(m.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(m.name)} on LinkedIn"><i class="fab fa-linkedin"></i></a>`
              : `<span class="social-placeholder" title="Add LinkedIn in data.js"><i class="fab fa-linkedin"></i></span>`
          }
        </div>
      </article>`
      )
      .join("");
  }

  function renderEvents() {
    const container = document.getElementById("events-container");
    if (!container) return;
    if (!data.events.length) {
      container.innerHTML =
        '<p class="section-intro">No upcoming events listed — check back soon or follow us on social media.</p>';
      return;
    }

    const sorted = [...data.events].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    container.innerHTML = sorted
      .map((ev) => {
        const { month, day, weekday } = formatEventDate(ev.date);
        return `
      <article class="event-card">
        <div class="event-date-box">
          <span class="month">${month}</span>
          <span class="day">${day}</span>
          <span class="weekday">${weekday}</span>
        </div>
        <div class="event-info">
          <h4>${escapeHtml(ev.title)}</h4>
          <p class="event-meta">${escapeHtml(ev.time)} · ${escapeHtml(ev.location)}</p>
          <p>${escapeHtml(ev.description)}</p>
          <button type="button" class="btn-rsvp" data-rsvp-id="${escapeHtml(ev.id)}">RSVP</button>
        </div>
      </article>`;
      })
      .join("");

    container.querySelectorAll(".btn-rsvp").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-rsvp-id");
        scrollToRsvp(id);
      });
    });

    populateRsvpSelect(sorted);
  }

  function populateRsvpSelect(events) {
    const select = document.getElementById("rsvp-event");
    if (!select) return;
    select.innerHTML =
      '<option value="">Select an event</option>' +
      events
        .map((ev) => {
          const { month, day } = formatEventDate(ev.date);
          const label = `${month} ${day} — ${ev.title}`;
          return `<option value="${escapeHtml(ev.id)}">${escapeHtml(label)}</option>`;
        })
        .join("");
  }

  function renderShowcase() {
    const grid = document.getElementById("showcase-grid");
    if (!grid) return;
    grid.innerHTML = data.showcase
      .map(
        (item) => `
      <article class="showcase-card">
        <img src="${escapeHtml(item.image)}" alt="" width="400" height="180" loading="lazy">
        <div class="showcase-body">
          <p class="year">${escapeHtml(item.year)}</p>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </article>`
      )
      .join("");
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function scrollToRsvp(eventId) {
    const section = document.getElementById("rsvp");
    const select = document.getElementById("rsvp-event");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    if (select && eventId) {
      const opt = Array.from(select.options).find((o) => o.value === eventId);
      if (opt) select.value = eventId;
    }
  }

  window.scrollToRsvp = scrollToRsvp;

  /* Navbar */
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* Mobile menu */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav-links");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("nav-active");
      burger.classList.toggle("toggle", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll("#nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-active");
        burger.classList.remove("toggle");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Email validation on club forms */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  document.querySelectorAll(".club-form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;
      const v = emailInput.value.trim();
      if (!emailPattern.test(v)) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        emailInput.focus();
      }
    });
  });

  /* Footer year */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  renderBoard();
  renderEvents();
  renderShowcase();
})();
