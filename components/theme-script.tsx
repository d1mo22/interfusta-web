// Fixed script, no user data: runs before paint so dark mode doesn't flash.
const THEME_SCRIPT =
	"(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()";

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
