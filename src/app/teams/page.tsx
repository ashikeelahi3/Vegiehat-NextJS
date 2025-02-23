"use client";

import teams from "./teamsData";

export default function Teams() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Meet Our Team</h1>

      <div className="space-y-6">
        {teams.map((member:any) => (
          <div
            key={member.id}
            className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6"
          >
            {/* Profile Image */}
            <img
              src={`/images/teams/${member.image}`}
              alt={member.name}
              className="w-40 h-40 object-cover rounded-full border-2 border-gray-300"
            />

            {/* Text Content */}
            <div className="flex-1">
              <h2 className="text-xl font-bold">{member.name}</h2>
              <p
                className="mt-2 text-gray-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: member.description }}
              />

              {/* Skills & Social Links */}
              <div className="mt-4">
                <p className="font-semibold">⭐ Skills: {member.skills}</p>

                <p className="font-semibold mt-2">🔗 Social Links:{" "}
                  {member.social_links.map((link: { id: string; url: string; name: string }, index: number) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-${index % 2 === 0 ? "blue" : "orange"}-500 font-semibold hover:underline mx-1`}
                    >
                      {link.name}
                    </a>
                  ))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
