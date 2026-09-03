/**
 * File: apps/web/src/hooks/useModal.js
 * Yegna AI - Modal Hook
 * 
 * Custom hook for managing modal state.
 */

import { useState, useCallback } from 'react';

/**
 * Modal management hook
 * 
 * @param {boolean} initialOpen - Initial modal open state
 * @returns {object} Modal state and control methods
 */
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [modalData, setModalData] = useState(null);
  
  /**
   * Open the modal
   * 
   * @param {object} data - Optional data to pass to modal
   */
  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);
  
  /**
   * Close the modal
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);
  
  /**
   * Toggle modal open/close
   */
  const toggleModal = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setModalData(null);
      }
      return !prev;
    });
  }, []);
  
  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal
  };
}