export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-purple-600 ">
        <div className="border-t border-white/20 pt-3 pb-3 text-center text-sm">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
    </footer>
  );
}