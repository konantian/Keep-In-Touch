import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { authenticated } from '../../authenticated';
import { get_post_by_id, update_post, delete_post } from '../../../../utils/postUtil';

export default authenticated(async function Post(req : NextApiRequest, res : NextApiResponse ){

  if(req.method === 'GET'){
      const post = await get_post_by_id(prisma, req.query.id);
      return res.status(200).json(post);

  }else if(req.method === 'PATCH'){
      const updatePost = await update_post(prisma, req.query.id, req.body);
      if(!updatePost){
          return res.status(400).json({error : "Cannot update this post now, please try again."})
      }
      await prisma.$disconnect();
      return res.status(200).json({success : "Post updated"});

  }else if(req.method === 'DELETE'){
      const deletePost = await delete_post(prisma, req.query.id);
      if(!deletePost){
        return res.status(400).json({error : "Cannot delete this post now, please try again."})
    }
      await prisma.$disconnect();
      return res.status(200).json({success : "Post deleted"});;

  }else{
      return res.status(405).json({error : "Only GET and PATCH available"});
  }
});