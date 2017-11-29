import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="text-center">
        <span>Copyrights &copy; {(new Date()).getFullYear()}. All rights reserved.</span>
      </footer>
    )
  }
}  

export default Footer;
