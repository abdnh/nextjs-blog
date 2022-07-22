import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div id="sidebar">
      <Link href="/">
        <a>
          <Image
            src="/favicon.ico"
            id="logo"
            alt="شعار المدونة؛ فضولي"
            width="64"
            height="64"
          />
        </a>
      </Link>
      <ul id="nav-links">
        <li>
          <Link id="about" href="/posts/about">
            <a>حول</a>
          </Link>
        </li>
        <li>
          <Link id="projects" href="/posts/projects">
            <a>مشاريع</a>
          </Link>
        </li>
        <li>
          <a id="wiki" href="https://www.abdnh.net/curious/">
            ويكي
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
