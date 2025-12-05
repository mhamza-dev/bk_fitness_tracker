/**
 * Comments Modal
 * Modal for viewing and creating comments on a post
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useComments, useLikes } from '../../hooks';
import { useAuth } from '../../contexts';
import { useSubscriptionStore } from '../../stores';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Button } from '../index';

export default function CommentsModal({ visible, post, onClose }) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { comments, loading, getPostComments, createComment } = useComments();
  const { likeComment, unlikeComment } = useLikes();
  const { hasActiveSubscription } = useSubscriptionStore();
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (visible && post) {
      loadComments();
    }
  }, [visible, post]);

  const loadComments = async () => {
    if (!post) return;
    try {
      await getPostComments(post._id || post.id);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async () => {
    if (!commentText.trim() || !post) return;

    // Check subscription before allowing comment
    if (!hasActiveSubscription()) {
      onClose();
      navigation.navigate('Subscription', { feature: 'comment on posts' });
      return;
    }

    setSending(true);
    try {
      await createComment({
        postId: post._id || post.id,
        text: commentText.trim(),
      });
      setCommentText('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSending(false);
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    // Check subscription before allowing like
    if (!hasActiveSubscription()) {
      onClose();
      navigation.navigate('Subscription', { feature: 'like posts' });
      return;
    }

    try {
      if (isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
      // Reload comments to get updated like counts
      await loadComments();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderComment = ({ item }) => {
    const isLiked = item.likes?.some(
      (like) => (like.user?._id || like.user?.id) === (user?.id || user?._id)
    );
    const userName = item.user?.name || item.user?.username || 'Unknown';
    const userAvatar = item.user?.avatar || item.user?.profilePicture;

    return (
      <View style={styles.commentItem}>
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.commentAvatar} />
        ) : (
          <View style={styles.commentAvatarPlaceholder}>
            <Text style={styles.commentAvatarText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.commentContent}>
          <View style={styles.commentBubble}>
            <Text style={styles.commentUser}>{userName}</Text>
            <Text style={styles.commentText}>{item.text || item.content}</Text>
          </View>
          <View style={styles.commentActions}>
            <Text style={styles.commentTime}>
              {formatTimestamp(item.createdAt)}
            </Text>
            {item.likesCount > 0 && (
              <Text style={styles.commentLikes}>
                {item.likesCount} {item.likesCount === 1 ? 'like' : 'likes'}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => handleLikeComment(item._id || item.id, isLiked)}
              style={styles.likeButton}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={Sizes.icon.s}
                color={isLiked ? Colors.error : Colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={Sizes.icon.l} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        {loading && comments.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item._id || item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No comments yet</Text>
                <Text style={styles.emptySubtext}>Be the first to comment!</Text>
              </View>
            }
          />
        )}

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={Colors.text.tertiary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!commentText.trim() || sending}
              style={[
                styles.sendButton,
                (!commentText.trim() || sending) && styles.sendButtonDisabled,
              ]}
            >
              {sending ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons name="send" size={Sizes.icon.m} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function formatTimestamp(date) {
  const now = new Date();
  const commentDate = new Date(date);
  const diffInSeconds = Math.floor((now - commentDate) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return commentDate.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.l,
    paddingVertical: Sizes.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Sizes.m,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: Sizes.l,
  },
  commentAvatar: {
    width: Sizes.avatar.xs,
    height: Sizes.avatar.xs,
    borderRadius: Sizes.avatar.xs / 2,
    marginRight: Sizes.m,
  },
  commentAvatarPlaceholder: {
    width: Sizes.avatar.xs,
    height: Sizes.avatar.xs,
    borderRadius: Sizes.avatar.xs / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizes.m,
  },
  commentAvatarText: {
    color: Colors.text.inverse,
    fontWeight: FontWeight.bold,
    fontSize: Sizes.fontSize.xs,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: Colors.background.secondary,
    padding: Sizes.m,
    borderRadius: BorderRadius.m,
    marginBottom: Sizes.xs,
  },
  commentUser: {
    fontSize: Sizes.fontSize.s,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.xs / 2,
  },
  commentText: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
    lineHeight: Sizes.fontSize.m * 1.4,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.xs,
  },
  commentTime: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.text.tertiary,
    marginRight: Sizes.m,
  },
  commentLikes: {
    fontSize: Sizes.fontSize.xs,
    color: Colors.text.secondary,
    marginRight: Sizes.m,
  },
  likeButton: {
    padding: Sizes.xs,
  },
  inputSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    padding: Sizes.m,
    backgroundColor: Colors.background.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Sizes.m,
    paddingVertical: Sizes.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  input: {
    flex: 1,
    fontSize: Sizes.fontSize.m,
    color: Colors.text.primary,
    maxHeight: Sizes.input.l * 3,
    paddingVertical: Sizes.xs,
  },
  sendButton: {
    padding: Sizes.xs,
    marginLeft: Sizes.xs,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    paddingTop: Sizes.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Sizes.fontSize.l,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.xs,
  },
  emptySubtext: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
});

