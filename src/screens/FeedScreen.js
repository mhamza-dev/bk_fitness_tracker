/**
 * Feed Screen
 * Displays posts from followed users and own posts
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../hooks';
import { Colors, Sizes, FontWeight } from '../styles';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/modals/CreatePostModal';
import CommentsModal from '../components/modals/CommentsModal';
import { useAuth } from '../contexts';
import { useSubscriptionStore } from '../stores';

export default function FeedScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { posts, loading, error, hasMore, getFeed, resetPagination, deletePost } = usePosts();
  const { hasActiveSubscription, fetchSubscription } = useSubscriptionStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    // Fetch subscription status on mount
    fetchSubscription();
  }, []);

  useEffect(() => {
    loadFeed(true);
  }, []);

  const loadFeed = async (reset = false) => {
    try {
      if (reset) {
        resetPagination();
      }
      await getFeed(reset);
    } catch (err) {
      console.error('Error loading feed:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        url: err.url,
      });

      // Handle 401 - Authentication failed
      if (err.status === 401 || err.isAuthError) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
              },
            },
          ]
        );
        return;
      }

      // Show user-friendly error message for 404
      if (err.status === 404) {
        Alert.alert(
          'Feed Unavailable',
          'The feed endpoint is not available. Please check if the backend is properly configured.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeed(true);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      await loadFeed(false);
    }
  };

  const handlePostCreated = () => {
    setShowCreateModal(false);
    loadFeed(true);
  };

  const handleLikePost = async (postId, isLiked) => {
    // Optimistic update handled in PostCard
  };

  const handleCommentPress = (post) => {
    // Check subscription before allowing comment
    if (!hasActiveSubscription()) {
      navigation.navigate('Subscription', { feature: 'comment on posts' });
      return;
    }
    setSelectedPost(post);
    setShowComments(true);
  };

  const handleShowSubscriptionModal = (feature) => {
    navigation.navigate('Subscription', { feature });
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      // Feed will be automatically updated by the hook
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const renderPost = ({ item }) => (
    <PostCard
      post={item}
      currentUserId={user?.id || user?._id}
      onLike={handleLikePost}
      onComment={() => handleCommentPress(item)}
      onDelete={handleDeletePost}
      onShowSubscriptionModal={handleShowSubscriptionModal}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>
          Follow users or create your first post!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />

      <CommentsModal
        visible={showComments}
        post={selectedPost}
        onClose={() => {
          setShowComments(false);
          setSelectedPost(null);
        }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Check subscription before allowing post creation
          if (!hasActiveSubscription()) {
            navigation.navigate('Subscription', { feature: 'create posts' });
            return;
          }
          setShowCreateModal(true);
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={Sizes.icon.xl} color={Colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  listContent: {
    paddingBottom: Sizes.l,
  },
  footerLoader: {
    paddingVertical: Sizes.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Sizes.xxxl * 2,
  },
  emptyText: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.s,
  },
  emptySubtext: {
    fontSize: Sizes.fontSize.m,
    color: Colors.text.secondary,
  },
  fab: {
    position: 'absolute',
    right: Sizes.l,
    bottom: Sizes.xxxl,
    width: Sizes.button.l,
    height: Sizes.button.l,
    borderRadius: Sizes.button.l / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

