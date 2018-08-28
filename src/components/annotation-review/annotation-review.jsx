import React, { Fragment } from 'react'
import cx from 'classnames'

import { translate } from '../../services'

import styles from './annotation-review.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'
import TextInput from '../../components/text-input/text-input'
import TextArea from '../../components/text-area/text-area'
import Button from '../../components/button/button'
import TextButton from '../../components/text-button/text-button'
import Tag from '../../components/tag/tag'

// TODO: Work with ids (generate in annotation-manager).
export default ({tags, onClose, tag, setTag, title, setTitle, description, setDescription, createTag, removeTag, handleSave, annotation, visible, setFullscreenImage, fullscreenImage, className}) =>
  <div className={cx(styles.AnnotationReview, global.BackgroundImage, !visible && styles.isHidden, className)}>
    <HeaderBar goBack={onClose} title="AnnotationReviewTitle" />

    {annotation && <Fragment>
      <div className={cx(styles.FullscreenImage, !fullscreenImage && styles.isHidden)} onClick={() => setFullscreenImage(false)} style={{backgroundImage: `url('${annotation.freezeFrame.thumbnailUrl}')`}} />

      <div className={cx(styles.AnnotationReviewContent, fullscreenImage && styles.isHidden)}>
        <div className={styles.Rows}>
          <div className={styles.Left}>
            <div className={styles.Section}>
              <div className={styles.Title}>{translate('AnnotationReviewTitleSection')}</div>
              <TextInput className={styles.Title} value={title} setValue={setTitle} />
            </div>

            <div className={styles.Section}>
              <div className={styles.Title}>{translate('AnnotationReviewTags')}</div>
              <div className={styles.TagSearch}>
                <TextInput className={styles.TagInput} value={tag} setValue={setTag} deleteButton onSubmit={createTag} />
                <Button className={styles.CreateTagButton} icon="add" small onClick={createTag} />
              </div>
              <div className={styles.Tags}>
                {tags.map(tag => <Tag key={tag} className={styles.tag} label={tag} onClick={() => removeTag(tag)}/>)}
              </div>
            </div>
          </div>

          <div className={styles.Right}>
            <img className={styles.AnnotationImage} src={annotation.freezeFrame.thumbnailUrl} onClick={() => setFullscreenImage(true)} />
          </div>
        </div>

        <div className={cx(styles.Section, styles.SectionDescription)}>
          <div className={styles.Title}>{translate('AnnotationReviewDescription')}</div>
          <TextArea className={styles.Description} value={description} setValue={setDescription} />
        </div>

        <div className={styles.Buttons}>
          <TextButton label="Save" onClick={() => handleSave(annotation)} />
        </div>

      </div>
    </Fragment>}
  </div>
