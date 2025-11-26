/**
 * Post Card Component
 * Displays a single post with image, caption, likes, comments
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Sizes, FontWeight, BorderRadius } from '../styles';
import { useLikes } from '../hooks';
import { useAuth } from '../contexts';

export default function PostCard({
  post,
  currentUserId,
  onLike,
  onComment,
  onDelete,
}) {
  const { likePost, unlikePost } = useLikes();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentsCount || 0);

  useEffect(() => {
    // Check if current user liked this post
    const liked = post.likes?.some(
      (like) => (like.user?._id || like.user?.id) === currentUserId
    ) || post.isLiked;
    setIsLiked(liked);
    setLikeCount(post.likesCount || post.likes?.length || 0);
    setCommentCount(post.commentsCount || post.comments?.length || 0);
  }, [post, currentUserId]);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;

    // Optimistic update
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);

    try {
      if (newLikedState) {
        await likePost(post._id || post.id);
      } else {
        await unlikePost(post._id || post.id);
      }
      if (onLike) {
        onLike(post._id || post.id, newLikedState);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(post._id || post.id);
            }
          },
        },
      ]
    );
  };

  const isOwnPost = (post.user?._id || post.user?.id) === currentUserId;

  // Get first media item from postMedia array (supporting legacy fields for backward compatibility)
  const firstMedia = post.postMedia?.[0] ||
    (post.imageUrl ? { mediaUrl: post.imageUrl, mediaType: 'image' } : null) ||
    (post.videoUrl ? { mediaUrl: post.videoUrl, mediaType: 'video' } : null) ||
    (post.image ? { mediaUrl: post.image, mediaType: 'image' } : null) ||
    (post.video ? { mediaUrl: post.video, mediaType: 'video' } : null) ||
    (post.images?.[0] ? { mediaUrl: post.images[0], mediaType: 'image' } : null) ||
    (post.videos?.[0] ? { mediaUrl: post.videos[0], mediaType: 'video' } : null);

  const userName = post.user?.name || post.user?.username || 'Unknown User';
  const userAvatar = post.user?.avatar || post.user?.profilePicture;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress && onUserPress(post.user?._id || post.user?.id)}
          activeOpacity={0.7}
        >
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userName}</Text>
            {post.location && (
              <Text style={styles.location}>{post.location}</Text>
            )}
          </View>
        </TouchableOpacity>
        {isOwnPost && (
          <TouchableOpacity onPress={handleDelete} style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={Sizes.icon.m} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Media (Image or Video) */}
      {firstMedia ? (
        firstMedia.mediaType === 'video' ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Ionicons name="videocam" size={Sizes.icon.xxl} color={Colors.text.secondary} />
              <Text style={styles.videoText}>Video</Text>
            </View>
          </View>
        ) : (
          <Image source={{ uri: firstMedia.mediaUrl }} style={styles.image} resizeMode="cover" />
        )
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={Sizes.icon.l}
              color={isLiked ? Colors.error : Colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onComment} style={styles.actionButton}>
            <Ionicons
              name="chatbubble-outline"
              size={Sizes.icon.l}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons
              name="share-outline"
              size={Sizes.icon.l}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Likes Count */}
      {likeCount > 0 && (
        <View style={styles.metrics}>
          <Text style={styles.metricText}>
            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
          </Text>
        </View>
      )}

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.captionUser}>{userName}</Text>
          {' '}
          {post.caption || post.description}
        </Text>
      </View>

      {/* Comments Count */}
      {commentCount > 0 && (
        <TouchableOpacity onPress={onComment} style={styles.commentsButton}>
          <Text style={styles.commentsText}>
            View all {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      {post.createdAt && (
        <Text style={styles.timestamp}>
          {formatTimestamp(post.createdAt)}
        </Text>
      )}
    </View>
  );
}

function formatTimestamp(date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return postDate.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    marginBottom: Sizes.l,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizes.m,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: Sizes.avatar.s,
    height: Sizes.avatar.s,
    borderRadius: Sizes.avatar.s / 2,
    marginRight: Sizes.m,
  },
  avatarPlaceholder: {
    width: Sizes.avatar.s,
    height: Sizes.avatar.s,
    borderRadius: Sizes.avatar.s / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.m,
  },
  avatarText: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
    fontSize: Sizes.fontSize.m,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  location: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Sizes.xs / 2,
  },
  moreButton: {
    padding: Sizes.xs,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.background.tertiary,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.background.tertiary,
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    marginTop: Sizes.m,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  actions: {
    padding: Sizes.m,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: Sizes.l,
    padding: Sizes.xs,
  },
  metrics: {
    paddingHorizontal: Sizes.m,
    paddingBottom: Sizes.xs,
  },
  metricText: {
    fontSize: Sizes.fontSize.m,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  captionContainer: {
    paddingHorizontal: Sizes.m,
    paddingBottom: Sizes.xs,
  },
  caption: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
    lineHeight: Sizes.fontSize.m * 1.4,
  },
  captionUser: {
    fontWeight: FontWeight.bold,
  },
  commentsButton: {
    paddingHorizontal: Sizes.m,
    paddingBottom: Sizes.xs,
  },
  commentsText: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
  },
  timestamp: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.text.tertiary,
    paddingHorizontal: Sizes.m,
    paddingBottom: Sizes.m,
  },
});

