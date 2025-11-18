/**
 * User Profile Modal
 * Modal for viewing user profile, followers, following, and posts
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePosts, useFollow } from '../../hooks';
import { useAuth } from '../../contexts';
import { Colors, Sizes, FontWeight, BorderRadius } from '../../styles';
import { Button, PostCard } from '../index';

export default function UserProfileModal({ visible, userId, onClose }) {
  const { user: currentUser } = useAuth();
  const { posts, loading: postsLoading, getUserPosts } = usePosts();
  const {
    followers,
    following,
    isFollowing,
    loading: followLoading,
    getFollowStatus,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
  } = useFollow();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'followers', 'following'
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (visible && userId) {
      loadUserData();
      loadUserPosts();
      checkFollowStatus();
    }
  }, [visible, userId]);

  const loadUserData = async () => {
    // This would typically fetch user data from API
    // For now, we'll use the userId to identify the user
    // You may need to add a getUserById API endpoint
  };

  const loadUserPosts = async () => {
    if (!userId) return;
    try {
      await getUserPosts(userId, true);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!userId || userId === (currentUser?.id || currentUser?._id)) return;
    try {
      await getFollowStatus(userId);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!userId) return;
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleShowFollowers = async () => {
    if (!userId) return;
    try {
      await getFollowers(userId);
      setShowFollowers(true);
    } catch (error) {
      console.error('Error loading followers:', error);
    }
  };

  const handleShowFollowing = async () => {
    if (!userId) return;
    try {
      await getFollowing(userId);
      setShowFollowing(true);
    } catch (error) {
      console.error('Error loading following:', error);
    }
  };

  const isOwnProfile = userId === (currentUser?.id || currentUser?._id);

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
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={Sizes.icon.l} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* User Info Section */}
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statItem} onPress={() => setActiveTab('posts')}>
                <Text style={styles.statValue}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem} onPress={handleShowFollowers}>
                <Text style={styles.statValue}>{followers.length}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem} onPress={handleShowFollowing}>
                <Text style={styles.statValue}>{following.length}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>

            {!isOwnProfile && (
              <Button
                title={isFollowing ? 'Unfollow' : 'Follow'}
                onPress={handleFollow}
                variant={isFollowing ? 'secondary' : 'primary'}
                size="large"
                fullWidth
                loading={followLoading}
                style={styles.followButton}
              />
            )}
          </View>

          {/* Posts Grid */}
          {activeTab === 'posts' && (
            <View style={styles.postsSection}>
              {postsLoading && posts.length === 0 ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : (
                <FlatList
                  data={posts}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.postThumbnail}>
                      <Image
                        source={{ uri: item.image || item.images?.[0] }}
                        style={styles.thumbnailImage}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item._id || item.id}
                  scrollEnabled={false}
                />
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
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
  content: {
    flex: 1,
  },
  userSection: {
    padding: Sizes.l,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Sizes.l,
  },
  avatar: {
    width: Sizes.avatar.xl,
    height: Sizes.avatar.xl,
    borderRadius: Sizes.avatar.xl / 2,
  },
  avatarPlaceholder: {
    width: Sizes.avatar.xl,
    height: Sizes.avatar.xl,
    borderRadius: Sizes.avatar.xl / 2,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Sizes.fontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.inverse,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: Sizes.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Sizes.xs,
  },
  statLabel: {
    fontSize: Sizes.fontSize.s,
    color: Colors.text.secondary,
  },
  followButton: {
    marginTop: Sizes.m,
  },
  postsSection: {
    padding: Sizes.xs,
  },
  loadingContainer: {
    padding: Sizes.xxxl,
    alignItems: 'center',
  },
  postThumbnail: {
    flex: 1,
    aspectRatio: 1,
    margin: Sizes.xs,
    borderRadius: BorderRadius.s,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
});

