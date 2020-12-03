import '../Stylesheets/ShareLink.css';
import React from 'react';

class ShareLink extends React.Component {
  
  render() {
    const url = window.location.href;
    return (
      <div className="share-link">
        {
          this.props.filledBoard ? 
          <div>
            <h3>Copy and share this link to your friends!</h3>
            <input type="url" readOnly={true} value={url} />
          </div>
          :
          <div>
            <h3>Probably shouldn't share an empty board ...</h3>      
          </div>
        }
      </div>
    );
  }
}

export default ShareLink;