import React, { Fragment } from 'react';
import cx from 'classnames';

import { translate } from '../../services';

import styles from './annotation-review.css';
import global from '../../../css/global.css';

import HeaderBar from '../../components/header-bar/header-bar';
import TextInput from '../../components/text-input/text-input';
import TextArea from '../../components/text-area/text-area';
import Button from '../../components/button/button';
import TextButton from '../../components/text-button/text-button';
import Tag from '../../components/tag/tag';

export default ({
  tags,
  onClose,
  tag,
  setTag,
  title,
  setTitle,
  description,
  setDescription,
  createTag,
  removeTag,
  handleSave,
  annotation,
  visible,
  setFullscreenImage,
  fullscreenImage,
  className,
}) => (
  <div
    className={cx(
      styles.AnnotationReview,
      global.BackgroundImage,
      !visible && styles.isHidden,
      className
    )}
  >
    {annotation && (
      <Fragment>
        <div
          className={cx(
            styles.AnnotationReviewContent,
            fullscreenImage && styles.isHidden
          )}
        >
          <div className={styles.Section}>
            <div className={styles.Header}>
              {translate('AnnotationReviewTitle')}
            </div>
          </div>
          <div
            className={cx(
              styles.FullscreenImage,
              !fullscreenImage && styles.isHidden
            )}
            onClick={() => setFullscreenImage(false)}
            style={{
              backgroundImage: `url('${annotation.screenshot}')`,
            }}
          />

          <div className={styles.Section}>
            <div className={styles.Title}>{translate('AnnotationReviewTitleSection')}</div>
            <TextInput
              className={styles.TagInput}
              value={title}
              setValue={setTitle}
            />
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

          <div className={cx(styles.Section, styles.SectionDescription)}>
            <div className={styles.Title}>{translate('AnnotationReviewDescription')}</div>
            <TextArea
              className={styles.Description}
              value={description}
              setValue={setDescription}
            />
          </div>

          <div className={styles.Buttons}>
            <TextButton label="Save" onClick={() => handleSave(annotation)} className={styles.SaveButton} />
          </div>
        </div>
      </Fragment>
    )}
  </div>
);
