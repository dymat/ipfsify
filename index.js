'use strict'

/* eslint-env browser */

import * as toBuffer from 'it-to-buffer'
import * as Ipfs from 'ipfs'


class Ipfsify {

  constructor(options = {}) {
    this.options = options
    this.run()
  }

  async run() {
    this.getDOMNodesWithIpfsAttribute()
    this.prevent_default_loading()

    this.ipfs = await Ipfs.create({ repo: 'ipfs-' + Math.random() })

    this.all()
  }


  all() {
    this.images()
  }

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
    this.domNodes["IMG"].forEach( this.image_prevent_http_loading );
  }

  image_prevent_http_loading(elem) {
    let src = elem.src
    elem.removeAttribute("src")
    elem.setAttribute("data-src", src)
  }

  load_image_http(elem) {
    let datasrc = elem.dataset.src
    elem.setAttribute("src", datasrc)
  }

}


const ipfsify = new Ipfsify({})
