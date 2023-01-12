import React, { memo } from 'react'
import { useFileReader, IMG_MIME_TYPES } from './useFileReader'
import { IconName, IconSprite } from '../../../../components/icon-sprite/IconSprite'
import cn from 'classnames'

import './profileAvatar.scss'

export const ProfileAvatar = memo(({ name }) => {

  const { fileIsUploaded, input, imageView, errorElem, label, closeBlock, container } = useFileReader(name)

  return (
    <div ref={container} className='profile-avatar'>
      <div className='profile-avatar__inner'>
        <button ref={closeBlock} className={cn('profile-avatar__trigger', 'is-remove', {'is-hidden': !fileIsUploaded})}>
          <IconSprite className='profile-avatar__trigger__icon profile-avatar__trigger__icon_small' name={IconName.CLOSE} />
        </button>
        <label className='profile-avatar__oval' ref={label}>
          <input
            ref={input}
            className='profile-avatar__input'
            accept={IMG_MIME_TYPES}
            type='file'
            name={name}
          />
          <IconSprite className='profile-avatar__oval__icon' name={IconName.USER} />
          <div ref={imageView} className='profile-avatar__preview' data-status={'hidden'} />
          <div className='profile-avatar__trigger is-add'>
            <IconSprite className='profile-avatar__trigger__icon' name={IconName.PLUS} />
          </div>
        </label>
      </div>
      {/* <span ref={errorElem} className='profile-avatar__error'>
        Error text
      </span> */}
    </div>
  )
})
