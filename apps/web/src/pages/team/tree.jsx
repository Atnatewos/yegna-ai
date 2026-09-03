/**
 * File: apps/web/src/pages/team/tree.jsx
 * Yegna AI - Team Tree Page
 * 
 * Displays the user's referral tree visualization.
 */

import React from 'react';
import { useQuery } from 'react-query';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import { getReferralTree } from '../../services/teamService';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/feedback/EmptyState';
import { Users } from 'lucide-react';

/**
 * Team tree page component
 */
export default function TeamTreePage() {
  const { showErrorToast } = useToast();
  const { t } = useTranslation('team');
  
  /**
   * Fetch referral tree
   */
  const { data, isLoading } = useQuery(
    'referralTree',
    () => getReferralTree(5),
    {
      onError: (error) => showErrorToast(error.message)
    }
  );
  
  const treeData = data?.data || [];
  
  /**
   * Render tree node recursively
   */
  const renderTreeNode = (node, depth = 0) => {
    return (
      <div key={node.id} className="team-tree-node" style={{ marginLeft: depth * 20 }}>
        <div className="team-tree-node-content">
          <div className="team-tree-node-avatar">
            {node.fullName?.[0] || node.username?.[0] || '?'}
          </div>
          <div className="team-tree-node-info">
            <p className="team-tree-node-name">{node.fullName || node.username}</p>
            <Badge variant={node.isActive ? 'success' : 'error'}>
              {node.isActive ? t('team.active') : t('team.inactive')}
            </Badge>
          </div>
        </div>
        {node.children && node.children.map((child) => renderTreeNode(child, depth + 1))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="team-tree-page">
        <div className="team-tree-loading">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="team-tree-page">
      <div className="team-tree-container">
        <Breadcrumbs />
        
        <div className="team-tree-header">
          <h1 className="team-tree-title">{t('team.teamTree')}</h1>
          <p className="team-tree-subtitle">{t('team.teamTreeSubtitle')}</p>
        </div>
        
        <Card className="team-tree-card">
          {treeData.length === 0 ? (
            <EmptyState
              icon={<Users size={48} />}
              title={t('team.noTeamMembers')}
              description={t('team.noTeamMembersDescription')}
            />
          ) : (
            <div className="team-tree-container">
              {treeData.filter((node) => node.level === 1).map((node) => renderTreeNode(node, 0))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}