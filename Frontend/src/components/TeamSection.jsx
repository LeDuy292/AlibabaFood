import React from 'react';
import './TeamSection.css';

const TEAM_MEMBERS = [
    { id: 1, name: 'Bùi Quyền', role: 'Chief Executive' },
    { id: 2, name: 'Lê Bảo', role: 'Chef' },
    { id: 3, name: 'Hoài Linh', role: 'Chef' },
    { id: 4, name: 'Trần Nguyên', role: 'Chef' },
    { id: 5, name: 'Sơn Tùng', role: 'Manager' },
    { id: 6, name: 'Tuấn Khải', role: 'Chef' },
];

const TeamSection = () => {
    return (
        <section className="team-section">
            <div className="team-background-band">
                <h2 className="section-title text-center text-white">Team Member</h2>
                <p className="team-subtitle text-center text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                {/* Placeholder for the broccoli/veg background decoration */}
                <div className="veg-decor-right"></div>
            </div>

            <div className="team-container container">
                <div className="team-grid">
                    {TEAM_MEMBERS.map(member => (
                        <div key={member.id} className="team-card">
                            <img
                                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&auto=format&fit=crop"
                                alt={member.name}
                                className="team-img"
                            />
                            <div className="team-info">
                                <h4 className="team-name">{member.name}</h4>
                                <p className="team-role">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
