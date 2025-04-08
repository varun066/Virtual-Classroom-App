import React from 'react';

const AnnouncementCard = ({ announcement ,onDelete,showDelete=false}) => {
  const {
    title,
    message,
    link,
    files,
    announcedBy,
    createdAt
  } = announcement;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.message}>{message}</p>

      {link && (
        <p>
          <strong>🔗Link:</strong>{' '}
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </p>
      )}

{files && files.length > 0 && (
  <div style={styles.files}>
    {files.map((file, index) => {
      const isImage = file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg');
      const isVideo = file.endsWith('.mp4') || file.endsWith('.mov');

      const fileUrl = `http://localhost:5000/uploads/announcements/${file}`;

      return (
        <div key={index} style={styles.media}>
          {isImage && <img src={fileUrl} alt="announcement" style={styles.image} />}
          {isVideo && (
            <video controls style={styles.video}>
              <source src={fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      );
    })}
  </div>
)}


      <p style={styles.footer}>
        <strong>📢Announced By:</strong> {announcedBy}
        <br />
        <strong>🕒Date:</strong>{' '}
        {new Date(createdAt).toLocaleString()}
      </p>

      {showDelete && (
        <button onClick={onDelete} style={styles.deleteButton}>Remove</button>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    padding: '1rem',
    margin: '1rem 0',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  message: {
    whiteSpace: 'pre-wrap',
    marginBottom: '0.5rem',
  },
  files: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
  },
  media: {
    maxWidth: '300px',
  },
  image: {
    width: '100%',
    borderRadius: '6px',
  },
  video: {
    width: '100%',
    borderRadius: '6px',
  },
  footer: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  deleteButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default AnnouncementCard;
