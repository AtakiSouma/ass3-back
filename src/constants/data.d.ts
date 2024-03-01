// Role Services

import mongoose from "mongoose";
import { StringLiteral } from "typescript";

export interface IRoles {
  title: string;
  description: string;
  id?: string;
}
export interface IRolesParams {
  title: string;
  description: string;
  id?: string;
}
export interface IRolesUpdate {
  title: string;
  description: string;
  id?: string;
  slug: string;
}

export interface IParams {
  slug: string;
}
// Role Services

// User Services
export interface IUsersParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface loginInput {
  email: string;
  password: string;
}

// Post
export interface IPostParams {
  title: string;
  // slug: string;
  description: string;
  tags: string[];
  price: number;
  creator_Id: string;
  rate: number;

}


export interface IPostsUpdate{
  title: string;
  description: string;
  status: boolean;
  slug:string;
  tags:mongoose.Types.ObjectId[] | ITags[];
  price:number;
  




}

export interface ILikePostsParams{
  user_id: string;
  post_slug: string;
}

// Post

// Tag

export interface ITagParams {
  title: string;
  description: string;
  // slug: string;
}
export interface ITagParamsSlug {
  title: string;
  description: string;
  slug: string;
}
// Tag

// user
export interface IUpdateProfile {
  username: string;
  avatar: string;
  phoneNumber: number;
  gender: boolean;
  uid: string;

}
export interface IChangeRoles{
  uid: string;
}




//

//email
export interface ISendEmail{
  receiver: string ; 
  subject: string ; 
  html: string;
}
export interface IforgotPassParams{
  email: string;
  // uid: string;
}
//email

// password
export interface IResetPasswordParams{
  password: string;
  confirmPassword: string;
  token: string;
}

// password


// dlllow creator
 export interface IFollowCreator{
  user_id:mongoose.Types.ObjectId;
  creator_id: mongoose.Types.ObjectId;
 }
//

// comment

export interface ICommentToCreatorProfileParams{
  comment: string;
  creator_id: string;
  user_id: string;

}
export interface ICommentParams{
  comment:string;
  user_id: string;
  orchid_slug: string;
}
export interface IReplyParams{
  reply:string;
  user_id: string;
  orchid_slug: string;
  comment_id:string;
}

export interface IReplyParamsToCreatorProfile{
  reply:string;
  user_id: string;
  creator_id: string;
  comment_id:string;
}

export interface ICommentLikeParams{
  user_id: string;
  comment_id: string;
}

export interface IDeleteCommentParams{
  user_id: string;
  comment_id:string;
}
// comment



// album
export interface ICreateAlbumParams{
  title: string;
  customer_id: string;
  thumbnail: string;
  slug: string;



}

export interface IUpdateAlbumParams{
  title: string;
  thumbnail: string;
  customer_id: string;
  slug: string;
}

export interface IDeleteAlbum{
  customer_id: string;
  slug: string;
}


export interface IOneAlbumParams{
  customer_id: string;
  slug: string;
}
// album

// post to album
export interface IPostToAlbumParams{
   post_slug: string ; 
   album_slug: string;
}
// post to album


// order

export interface IOrderParams{
  customer_id:string;
  post_slug: string;
}

// order

// public
export interface IPaginationParams {
  search: string;
  page: number;
  limit: number;
  sort:string;
  sortOrder : "asc" | "desc";
  titleSortOrder: "asc" | "desc";
  likeCountSortOrder: "asc" | "desc";
  tags:Array<>;
}

export interface  IPaginationParamsRole{
  search: string;
  page: number;
  limit: number;
}

export interface IUidParams{
  uid: string;
}
export interface IEmailParams{
  email: string;
}

export interface IPaginationAlbumParams {
  search: string;
  page: number;
  limit: number;
  customer_id: string;
}



