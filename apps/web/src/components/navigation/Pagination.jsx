/**
 * File: apps/web/src/components/navigation/Pagination.jsx
 * Yegna AI - Pagination Component
 * 
 * Reusable pagination component.
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component
 * 
 * @param {object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Page change handler
 * @param {number} props.siblingCount - Number of sibling pages to show
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}) {
  if (totalPages <= 1) return null;
  
  /**
   * Generate page numbers array
   */
  const generatePageNumbers = () => {
    const pages = [];
    const totalPageNumbers = siblingCount * 2 + 5;
    
    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < totalPages - 1;
      
      pages.push(1);
      
      if (showLeftDots) {
        pages.push('...');
      }
      
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (showRightDots) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = generatePageNumbers();
  
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="pagination-dots">
              ...
            </span>
          );
        }
        
        return (
          <button
            key={`page-${page}`}
            type="button"
            className={`pagination-button ${page === currentPage ? 'pagination-button-active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      
      <button
        type="button"
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}