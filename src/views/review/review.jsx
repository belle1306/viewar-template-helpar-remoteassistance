import React, { Fragment } from 'react'
import cx from 'classnames'

import { translate } from '../../services'

import styles from './review.css'
import global from '../../../css/global.css'

import HeaderBar from '../../components/header-bar/header-bar'
import TextInput from '../../components/text-input/text-input'
import AnnotationReview from '../../components/annotation-review/annotation-review'
import Button from '../../components/button/button'
import TextButton from '../../components/text-button/text-button'
import Tag from '../../components/tag/tag'

export default ({annotation, setAnnotation, tags, tag, setTag, comment, createTag, removeTag, annotations, removeAnnotation, updateAnnotation, saveReview}) =>
  <div className={cx(styles.Review, global.BackgroundImage)}>
    {!annotation && <Fragment>
    <HeaderBar title="ReviewTitle" />
    <div className={styles.ReviewContent}>

      <div className={styles.Section}>
        <div className={styles.Title}>{translate('ReviewGeneralTags')}</div>
        <div className={styles.TagSearch}>
          <TextInput className={styles.TagInput} value={tag} setValue={setTag} deleteButton onSubmit={createTag} />
          <Button className={styles.CreateTagButton} icon="add" small onClick={createTag} />
        </div>
        <div className={styles.Tags}>
          {tags.map(tag => <Tag key={tag} className={styles.tag} label={tag} onClick={() => removeTag(tag)}/>)}
        </div>
      </div>

      <div className={styles.Section}>
        <div className={styles.Title}>{translate('ReviewAnnotations')}</div>
        <div className={styles.Annotations}>
          {annotations.map(annotation =>
            <div key={annotation.id} className={cx(styles.Annotation, annotation.title && styles.isDone)}>
              <img src={annotation.freezeFrame.thumbnailUrl}  onClick={() => setAnnotation(annotation)} />
              <div className={cx(styles.AnnotationDelete, global.ButtonImage)} onClick={() => removeAnnotation(annotation)} />
              {!!annotation.title && <Fragment>
                <div className={cx(styles.AnnotationCheckmark, global.ButtonImage)} />
                <div className={styles.AnnotationTitle}>{annotation.title}</div>
              </Fragment>}
            </div>)}
        </div>
      </div>

      <div className={styles.Buttons}>
        <TextButton label="Save" onClick={saveReview} />
      </div>

    </div>

    </Fragment>}
    <AnnotationReview annotation={annotation} visible={annotation} onClose={() => setAnnotation(null)} onSave={updateAnnotation} className={styles.AnnotationReview} />
  </div>
