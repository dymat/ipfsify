'use strict'

/* eslint-env browser */

import * as toBuffer from 'it-to-buffer'
import * as Ipfs from 'ipfs'


class Ipfsify {

  constructor(options = {}) {
    this.options = options
    this.run()
  }

  // prepare DOM and start ipfs node
  async run() {
    this.getDOMNodesWithIpfsAttribute()
    this.prevent_default_loading()

    this.ipfs = await Ipfs.create({ repo: 'ipfs-' + Math.random() })

    // ipfsify all elements (you might want to change that to the desired tags)
    this.all()
  }


  // ipfsify all elements
  all() {
    this.images()

    // extend this if other elements should be loaded via ipfs, too
    // e.g. this.domNodes["SCRIPT"].forEach( this.scripts )
  }


  // finds all HTML tags with "ipfs"-attribute
  getDOMNodesWithIpfsAttribute() {
    this.domNodes = {}

    let nodes = document.querySelectorAll("[ipfs]")
    nodes.forEach( node => {
      if ( !this.domNodes.hasOwnProperty(node.tagName) ) {
        this.domNodes[node.tagName] = [node]
      } else {
        this.domNodes[node.tagName].push(node)
      }
    })
  }


  prevent_default_loading() {
    this.domNodes["IMG"].forEach( this.image_prevent_http_loading )

    // extend this if other elements should be loaded via ipfs, too
    // e.g. this.domNodes["SCRIPT"].forEach( this.script_prevent_http_loading )
  }


  // START ipfsify images
  // (ipfsify for other elements will be implemented step by step)
  async images() {
    this.domNodes['IMG'].forEach( async elem => {
      let hash = elem.getAttribute("ipfs")
      try {
        const buffer = await toBuffer(this.ipfs.cat(hash, this.options))
        elem.src = URL.createObjectURL( new Blob([buffer.buffer]))
      } catch ( e ) {
        console.log("Could not load images via IPFS", e)
        this.load_image_http(elem)
        return
      }
    })
  }


  // stop the browser from loading images traditionally
  image_prevent_http_loading(elem) {
    let src = elem.src
    elem.removeAttribute("src")
    elem.setAttribute("data-src", src)
  }


  // rollback: load image traditionally if not possible over ipfs
  load_image_http(elem) {
    let datasrc = elem.dataset.src
    elem.setAttribute("src", datasrc)
  }
  // END ipfsify images

}

// instatiate object and ipfsify all images with "ipfs"-attribute
const ipfsify = new Ipfsify({})
