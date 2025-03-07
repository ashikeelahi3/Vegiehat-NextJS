"use client";

import teams from "../../Data/teamsData";

export default function Teams() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Meet Our Team</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {teams.map((member:any) => (
          <div
            key={member.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6 transition-colors duration-300"
          >
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={`/images/teams/${member.image}`}
                alt={member.name}
                className="w-40 h-40 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h2>
              <p
                className="mt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: member.description }}
              />

              {/* Skills & Social Links */}
              <div className="mt-4 space-y-2">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  <span className="mr-2">⭐</span>
                  <span>Skills:</span> 
                  <span className="text-gray-700 dark:text-gray-300 ml-1">{member.skills}</span>
                </p>

                <div className="font-semibold text-gray-800 dark:text-gray-200">
                  <span className="mr-2">🔗</span>
                  <span>Social Links:</span>{" "}
                  <div className="inline-flex flex-wrap gap-2 mt-1">
                    {member.social_links.map((link: { id: string; url: string; name: string }, index: number) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          index % 2 === 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-500 dark:text-orange-400"
                        } font-semibold hover:underline transition-colors`}
                      >
                        {link.name}
                      </a>
                    ))}
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
