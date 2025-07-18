import { Router } from 'express';
import {

getAllEditoriales,  
getEditorialById,
createEditorial,
updateEditorialById,
deleteEditorialById,
} from '../controllers/editorial.controller';

const router = Router();

// Obtener todas las editoriales
router.get('/', getAllEditoriales);

// Obtener una editorial por ID
router.get('/:id', getEditorialById);

// Crear una nueva editorial
router.post('/', createEditorial);

// Actualizar una editorial existente
router.put('/:id', updateEditorialById);

// Eliminar una editorial
router.delete('/:id', deleteEditorialById);

export default router;