import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  function faviconTransitionEndHandler(event) {
    if (event.elapsedTime >= 5) {
      window.location.assign("/fuduuli");
    }
  }
  return (
    <div id="sidebar">
      <Link href="/">
        <Image
          src="/favicon.ico"
          id="logo"
          alt="شعار المدونة؛ فضولي"
          width="64"
          height="64"
          onTransitionEnd={faviconTransitionEndHandler}
        />
      </Link>
      <ul id="nav-links">
        <li>
          <Link id="about" href="/about">
            حول
          </Link>
        </li>
        <li>
          <Link id="projects" href="/projects">
            مشاريع
          </Link>
        </li>
        <li>
          <a id="wiki" href="/curious/">
            ويكي
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
