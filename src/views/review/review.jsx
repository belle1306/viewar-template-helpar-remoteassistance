import React, { Fragment } from 'react';
import cx from 'classnames';

import styles from './review.scss';
import global from '../../../css/global.scss';

import { translate } from '../../services';
import {
  AdminHeaderBar,
  TextInput,
  AnnotationReview,
  Button,
  TextButton,
  Tag,
} from '../../components';

const ReviewTemplate = ({
  annotation,
  setAnnotation,
  tags,
  tag,
  setTag,
  comment,
  createTag,
  removeTag,
  annotations,
  removeAnnotation,
  updateAnnotation,
  saveReview,
  cancelReview,
  userName,
}) => (
  <div className={cx(styles.Review, global.BackgroundImage)}>
    <AdminHeaderBar userName={userName} />
    {!annotation && (
      <Fragment>
        <div className={styles.ReviewContent}>
          <div className={styles.Section}>
            <div className={styles.Header}>{translate('ReviewTitle')}</div>
          </div>
          <div className={styles.Section}>
            <div className={styles.Title}>{translate('ReviewGeneralTags')}</div>
            <div className={styles.TagSearch}>
              <TextInput
                className={styles.TagInput}
                placeholder="ReviewYourTags"
                value={tag}
                setValue={setTag}
                onSubmit={createTag}
                addButton
              />
            </div>
            {!!tags.length && (
              <div className={styles.Tags}>
                {tags.map(tag => (
                  <Tag
                    key={tag}
                    className={styles.Tag}
                    label={tag}
                    onClick={() => removeTag(tag)}
                  />
                ))}
              </div>
            )}
          </div>

          {!!annotations.length && (
            <div className={cx(styles.Section, styles.SectionAnnotations)}>
              <div className={styles.Annotations}>
                {annotations.map(
                  annotation =>
                    annotation.screenshot && (
                      <div
                        key={annotation.id}
                        className={cx(
                          styles.Annotation,
                          !!annotation.title && styles.isDone
                        )}
                      >
                        <div
                          className={styles.AnnotationImage}
                          style={{
                            backgroundImage: `url('${annotation.screenshot}'`,
                          }}
                        />

                        <div className={styles.AnnotationButtons}>
                          <Button
                            icon="cancel"
                            onClick={() => removeAnnotation(annotation)}
                            className={styles.AnnotationButton}
                            noBackground
                            white
                          />
                          <Button
                            icon="pencil"
                            onClick={() => setAnnotation(annotation)}
                            className={styles.AnnotationButton}
                            noBackground
                            white
                          />
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          <div className={styles.Buttons}>
            <TextButton
              label="ReviewSave"
              onClick={saveReview}
              className={styles.SaveButton}
            />
          </div>
          <div className={styles.Buttons}>
            <TextButton
              label="ReviewCancel"
              onClick={cancelReview}
              className={styles.SaveButton}
            />
          </div>
        </div>
      </Fragment>
    )}
    <AnnotationReview
      annotation={annotation}
      visible={annotation}
      onClose={() => setAnnotation(null)}
      onSave={updateAnnotation}
      className={styles.AnnotationReview}
    />
  </div>
);

export default ReviewTemplate;
