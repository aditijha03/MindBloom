const { supabaseAdmin } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');

const uploadAvatar = async (userId, file) => {
  if (!file) throw new AppError('No file uploaded.', 400, 'BAD_REQUEST');

  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}/${uuidv4()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from('uploads')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return publicUrl;
};

module.exports = {
  uploadAvatar
};
