import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 md:py-8 mt-auto flex justify-center items-center px-4">
      <a 
        href="https://peso-site.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        dir="ltr"
        className="group relative px-5 md:px-6 py-2.5 md:py-2.5 rounded-xl md:rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex items-center gap-2 md:gap-3 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 active:scale-95"
      >
        <span className="text-[9px] md:text-[10px] font-mono text-slate-500 tracking-wider md:tracking-widest group-hover:text-slate-300 transition-colors uppercase">
          {'< Developed By />'}
        </span>
        
        <div className="h-4 md:h-5 w-[1px] md:w-[1.5px] bg-slate-700/50 group-hover:bg-slate-600 transition-colors"></div>
        
        <span className="text-lg md:text-xl font-black tracking-tighter flex items-center gap-0.5">
          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">P</span>
          <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">E</span>
          <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">S</span>
          <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">O</span>
        </span>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
      </a>
    </footer>
  );
};

export default Footer;
