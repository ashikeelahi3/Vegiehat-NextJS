"use client";

import teams from "../../Data/teamsData";

export default function Teams() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center mb-10 text-vegiehat-primary dark:text-vegiehat-accent">
        Meet Our Team
        <div className="w-24 h-1 bg-gradient-to-r from-vegiehat-primary to-vegiehat-secondary dark:from-vegiehat-secondary dark:to-vegiehat-accent mx-auto mt-2"></div>
      </h1>

      <div className="max-w-5xl mx-auto space-y-12">
        {teams.map((member: any) => (
          <div
            key={member.id}
            className="bg-vegiehat-light dark:bg-gray-800 overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-transparent hover:border-vegiehat-accent/20 dark:hover:border-vegiehat-secondary/20"
          >
            <div className="flex flex-col md:flex-row">
              {/* Profile Image Section */}
              <div className="md:w-1/3 bg-gradient-to-br from-vegiehat-primary to-vegiehat-secondary dark:from-vegiehat-dark dark:to-vegiehat-primary p-6 flex items-center justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-white dark:bg-gray-700 p-1">
                    <img
                      src={`/images/teams/${member.image}`}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-0 right-0 text-center">
                    <span className="inline-block bg-vegiehat-pepper text-vegiehat-dark text-xs font-bold px-3 py-1 rounded-full">
                      {member.role || "Team Member"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="md:w-2/3 p-6">
                <h2 className="text-2xl font-bold text-vegiehat-primary dark:text-vegiehat-accent">{member.name}</h2>
                
                <div 
                  className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: member.description }}
                />

                {/* Information Cards */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Skills Card */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-vegiehat-accent dark:bg-vegiehat-secondary flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-vegiehat-primary dark:text-vegiehat-accent">Professional Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.split(',').map((skill: string, idx: number) => (
                        <span 
                          key={idx}
                          className="inline-block bg-vegiehat-light dark:bg-gray-700 text-vegiehat-primary dark:text-vegiehat-accent px-3 py-1 text-sm rounded-full"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hobby Card */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-vegiehat-pepper flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-vegiehat-primary dark:text-vegiehat-accent">Hobbies & Interests</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.hobbies ? (
                        member.hobbies.split(',').map((hobby: string, idx: number) => (
                          <span 
                            key={idx}
                            className="inline-block bg-vegiehat-light/50 dark:bg-gray-700/50 text-vegiehat-dark dark:text-vegiehat-light px-3 py-1 text-sm rounded-full"
                          >
                            {hobby.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm italic">Information not available</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Social Links Card */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-vegiehat-secondary dark:bg-vegiehat-accent flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-vegiehat-primary dark:text-vegiehat-accent">Connect With {member.name.split(' ')[0]}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {member.social_links.map((link: { id: string; url: string; name: string }) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-vegiehat-light dark:bg-gray-700 hover:bg-vegiehat-primary hover:text-white dark:hover:bg-vegiehat-accent dark:hover:text-gray-900 rounded-md transition-colors"
                        >
                          {getSocialIcon(link.name)}
                          <span className="ml-2">{link.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get social media icons
function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'github':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'portfolio':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
}
