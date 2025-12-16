import React, { useEffect, useState } from 'react';
import { Linkedin, Star, StarHalf, User } from 'lucide-react';
import { TeamMember } from '../types';
import { teamMembers } from '../teamData';

const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  useEffect(() => {
    // Simulate loading
    setMembers(teamMembers);
    setFilteredMembers(teamMembers);
    setLoading(false);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeFilter === 'ALL') {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(members.filter(member => member.category === activeFilter));
    }
  }, [activeFilter, members]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="star-half" className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    // Fill remaining with empty stars if needed (assuming out of 5)
    while (stars.length < 5) {
      stars.push(<Star key={`star-empty-${stars.length}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const filters = [
    { key: 'ALL', label: 'الكل' },
    { key: 'FE', label: 'واجهات (Frontend)' },
    { key: 'BE', label: 'أنظمة (Backend)' },
    { key: 'UX', label: 'تصميم (UX/UI)' },
    { key: 'MOBILE', label: 'تطبيقات (Mobile)' },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="text-accent font-bold tracking-wider uppercase mb-2 block animate-in fade-in slide-in-from-bottom-3">
            فريق الخبراء
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 delay-100">
            نخبة من <span className="text-accent">أفضل الكفاءات</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-5 delay-200">
            تعرف على فريقنا المتميز من الخبراء التقنيين المستعدين لمساعدتك في رحلتك المهنية.
          </p>
        </div>

        {/* Filters Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-in fade-in slide-in-from-bottom-6 delay-300">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${
                activeFilter === filter.key
                  ? 'bg-accent text-white shadow-lg shadow-accent/25 transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                <div 
                  key={member.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-2 animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {member.photoUrl ? (
                      <img 
                        src={member.photoUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {/* Fallback Icon */}
                    <div className={`absolute inset-0 flex items-center justify-center text-gray-400 ${member.photoUrl ? 'hidden' : ''}`}>
                      <User className="w-20 h-20" />
                    </div>
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Social Links (LinkedIn) */}
                    {member.linkedinUrl && (
                      <div className="absolute bottom-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <a 
                          href={member.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white p-2 rounded-full text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-colors shadow-lg flex items-center justify-center"
                          aria-label={`LinkedIn profile of ${member.name}`}
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center relative">
                     {/* Rating Badge */}
                     <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100 flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{member.rating}</span>
                     </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-accent font-medium text-sm mb-4">{member.role}</p>
                    
                    <div className="flex justify-center gap-1 opacity-80" aria-label={`Rating: ${member.rating} out of 5`}>
                      {renderStars(member.rating)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>لا يوجد خبراء في هذا التصنيف حالياً.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;