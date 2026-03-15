import { Router } from 'express';
import { NotFoundController } from './NotFound.controller';
import { NotFoundService } from './NotFound.service';
import { NotFoundRepository } from './NotFound.repository';

const router = Router();

const repository = new NotFoundRepository();
const service = new NotFoundService(repository);
const controller = new NotFoundController(service);

/**
 * @route   POST /api/captain/not-found
 * @desc    Create a new CaptainNotFound entry
 * @access  Private
 */
router.post('/', controller.create);

/**
 * @route   GET /api/captain/not-found
 * @desc    Get all CaptainNotFound entries
 * @access  Private
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/captain/not-found/:id
 * @desc    Get CaptainNotFound entry by ID
 * @access  Private
 */
router.get('/:id', controller.getById);

/**
 * @route   PUT /api/captain/not-found/:id
 * @desc    Update CaptainNotFound entry (full update)
 * @access  Private
 */
router.put('/:id', controller.update);

/**
 * @route   PATCH /api/captain/not-found/:id
 * @desc    Update CaptainNotFound entry (partial update)
 * @access  Private
 */
router.patch('/:id', controller.update);

/**
 * @route   DELETE /api/captain/not-found/:id
 * @desc    Delete CaptainNotFound entry
 * @access  Private
 */
router.delete('/:id', controller.delete);

export default router;
