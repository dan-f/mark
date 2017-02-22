/* global $ */
import React from 'react'

export default class Modal extends React.Component {
  render () {
    const { children, title, onClickSave, onClickCancel } = this.props
    return (
      <div className='row'>
        <div className='col'>
          <div className='modal fade' tabIndex='-1' role='dialog' aria-labelledby='modal-title' aria-hidden='true' data-backdrop='static'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 id='modal-title' className='modal-title'>{title}</h5>
                  <button type='button' className='close' aria-label='Close' onClick={onClickCancel}>
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>
                <div className='modal-body'>
                  {children}
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-primary' onClick={onClickSave}>Save changes</button>
                  <button type='button' className='btn btn-secondary' onClick={onClickCancel}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentWillEnter (callback) {
    $('.modal')
      .on('shown.bs.modal', callback)
      .modal('show')
  }

  componentWillLeave (callback) {
    $('.modal')
      .on('hidden.bs.modal', callback)
      .modal('hide')
  }
}
