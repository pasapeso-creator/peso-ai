import React from 'react';
import { StudentData } from '../types';
import { Upload, User, FileText, Building, BookOpen, Hash, GraduationCap } from 'lucide-react';
import EnglishNotice from './EnglishNotice';

interface InputFormProps {
  data: StudentData;
  onChange: (data: StudentData) => void;
  showTeamOption?: boolean;
  onTeamAdd?: (member: { name: string; id: string }) => void;
  teamMembers?: { name: string; id: string }[];
}

const InputForm: React.FC<InputFormProps> = ({ data, onChange, showTeamOption, onTeamAdd, teamMembers }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if ((name === 'logo' || name === 'collegeLogo') && files) {
      onChange({ ...data, [name]: files[0] });
    } else {
      onChange({ ...data, [name]: value });
    }
  };

  const [newMember, setNewMember] = React.useState({ name: '', id: '' });

  const handleAddMember = () => {
    if (newMember.name && newMember.id && onTeamAdd) {
      onTeamAdd(newMember);
      setNewMember({ name: '', id: '' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700/50 shadow-2xl mb-8 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
          <User className="w-5 h-5 text-white" />
        </div>
        Student Data / Project Info
      </h3>

      {/* English Notice */}
      <EnglishNotice />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Name */}
        <div className="relative group">
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <User size={14} className="text-blue-400" />
            Student Name
          </label>
          <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 overflow-hidden transition-all">
            <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><User size={18}/></span>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
              placeholder="Ex: Mohamed Ahmed"
              dir="ltr"
            />
          </div>
        </div>

        {/* ID */}
        <div className="relative group">
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <Hash size={14} className="text-blue-400" />
            Student ID
          </label>
          <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 overflow-hidden transition-all">
            <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><Hash size={18}/></span>
            <input
              type="text"
              name="studentId"
              value={data.studentId}
              onChange={handleChange}
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
              placeholder="20230000"
              dir="ltr"
            />
          </div>
        </div>
        
        {/* Team Members Section - Moved here */}
        {showTeamOption && (
          <div className="col-span-1 md:col-span-2 bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
             <label className="block text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
               <User size={14} className="text-purple-400" />
               Add Team Members (Optional)
             </label>
             <div className="flex flex-col md:flex-row gap-3 mb-3">
               <input 
                 type="text" 
                 placeholder="Student Name" 
                 className="bg-slate-900/80 p-3 rounded-lg border-2 border-slate-600 text-white flex-1 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 text-sm"
                 value={newMember.name}
                 onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                 dir="ltr"
               />
               <input 
                 type="text" 
                 placeholder="ID" 
                 className="bg-slate-900/80 p-3 rounded-lg border-2 border-slate-600 text-white w-full md:w-32 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 text-sm"
                 value={newMember.id}
                 onChange={(e) => setNewMember({...newMember, id: e.target.value})}
                 dir="ltr"
               />
               <button 
                 type="button"
                 onClick={handleAddMember}
                 className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 text-sm"
               >
                 Add Local
               </button>
             </div>
             
             {teamMembers && teamMembers.length > 0 && (
               <div className="flex flex-wrap gap-2">
                  {teamMembers.map((m, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-2 border border-purple-500/30">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-slate-400 opacity-75">({m.id})</span>
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

        {/* Subject */}
        <div className="relative group">
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <BookOpen size={14} className="text-blue-400" />
            Subject Name
          </label>
          <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 overflow-hidden transition-all">
            <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><BookOpen size={18}/></span>
            <input
              type="text"
              name="subject"
              value={data.subject}
              onChange={handleChange}
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
              placeholder="Ex: Artificial Intelligence"
              dir="ltr"
            />
          </div>
        </div>

        {/* Doctor Name (Optional) */}
        <div className="relative group">
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <GraduationCap size={14} className="text-blue-400" />
            Doctor Name (Optional)
          </label>
          <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 overflow-hidden transition-all">
            <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><GraduationCap size={18}/></span>
            <input
              type="text"
              name="drName"
              value={data.drName}
              onChange={handleChange}
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
              placeholder="Ex: Dr. Ali Hassan"
              dir="ltr"
            />
          </div>
        </div>

        {/* College */}
        <div className="relative group">
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <Building size={14} className="text-blue-400" />
            College
          </label>
          <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 overflow-hidden transition-all">
            <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><Building size={18}/></span>
            <input
              type="text"
              name="college"
              value={data.college}
              onChange={handleChange}
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
              placeholder="Ex: Faculty of Computer Science"
              dir="ltr"
            />
          </div>
        </div>

        {/* Department (Optional) */}
        <div className="relative group">
          <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
            <FileText size={14} className="text-blue-400" />
            Department (Optional)
          </label>
          <div className="flex items-center bg-slate-900/80 rounded-xl border-2 border-slate-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 overflow-hidden transition-all">
            <span className="px-4 py-3 bg-slate-800/50 border-r border-slate-600 text-slate-400"><FileText size={18}/></span>
            <input
              type="text"
              name="department"
              value={data.department}
              onChange={handleChange}
              className="w-full bg-transparent p-4 text-white focus:outline-none placeholder:text-slate-500"
              placeholder="Ex: CS Department"
              dir="ltr"
            />
          </div>
        </div>
        
        {/* Logo Upload */}
        <div className="col-span-1 md:col-span-2">
           <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
             <Upload size={14} className="text-blue-400" />
             University Logo (Optional - will appear in PDF)
           </label>
           <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer bg-slate-900/50 relative group">
             <input 
                type="file" 
                name="logo" 
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             {data.logo ? (
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-lg overflow-hidden mb-3 border-2 border-blue-500">
                   <img 
                     src={URL.createObjectURL(data.logo)} 
                     alt="Preview" 
                     className="w-full h-full object-contain"
                   />
                 </div>
                 <span className="text-blue-400 font-medium">{data.logo.name}</span>
                 <span className="text-xs text-slate-500 mt-1">Click to change</span>
               </div>
             ) : (
               <>
                 <div className="p-3 bg-slate-800 rounded-xl mb-3 group-hover:bg-blue-500/20 transition-colors">
                   <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" />
                 </div>
                 <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">Click to upload university logo</span>
                 <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</span>
               </>
             )}
           </div>
        </div>

        {/* College Logo Upload */}
        <div className="col-span-1 md:col-span-2">
           <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center gap-2">
             <Upload size={14} className="text-purple-400" />
             College Logo (Optional - will appear opposite to Uni logo)
           </label>
           <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer bg-slate-900/50 relative group">
             <input 
                type="file" 
                name="collegeLogo" 
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             {data.collegeLogo ? (
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-lg overflow-hidden mb-3 border-2 border-purple-500">
                   <img 
                     src={URL.createObjectURL(data.collegeLogo)} 
                     alt="Preview" 
                     className="w-full h-full object-contain"
                   />
                 </div>
                 <span className="text-purple-400 font-medium">{data.collegeLogo.name}</span>
                 <span className="text-xs text-slate-500 mt-1">Click to change</span>
               </div>
             ) : (
               <>
                 <div className="p-3 bg-slate-800 rounded-xl mb-3 group-hover:bg-purple-500/20 transition-colors">
                   <Upload className="w-8 h-8 text-slate-400 group-hover:text-purple-400 transition-colors" />
                 </div>
                 <span className="text-sm font-medium group-hover:text-purple-400 transition-colors">Click to upload college logo</span>
                 <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</span>
               </>
             )}
           </div>
        </div>
      </div>


    </div>
  );
};

export default InputForm;