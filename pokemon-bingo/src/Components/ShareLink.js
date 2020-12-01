import '../Stylesheets/ShareLink.css';
import React from 'react';

class ShareLink extends React.Component {
  render() {
    return (
      <div className="share-link">
        {
          this.props.url ? 
          <div>
            <h3>Copy and share this link to your friends!</h3>
            <input type="url" readOnly="true" value={this.props.url} />
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