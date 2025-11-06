1. Email verified, still in pending stage
    1.1 Need to verify image, tag line and description manually by admin then status will change
    1.2 once verified by admin then profile active

2. If image, tagline and description changed later then those data needs to verified before showing on frontend.

3. Girl posted dated
    1. If anything chagned or , blocked or change request send then date will be in deactive stage.


email_verified
image_verified



For batch

>documents_verified will be verified seprately


If user approved all the status ( email_verified, image_verified ) will be true ( verified )

Fire localhost:3001/api/v1/user/update-status to update the user status
0 : Pending, 1: Verified, 2 Block, 3: Delete

##  As on 1st July call
1 : Pending, 2: Verified, 3 Block, 4: Delete



Need to check this API for message number
Fire localhost:3001/api/v1/defaultMessage/requestMessage

Send message ID with email list, see the API DOC

TO get the verified batch

Fire : localhost:3001/api/v1/user/getverified
with selfie and doc ( one each )



If tagline, description and image will be verified all together.


If user updates ( check that all these values are udpated on status=1 change)

tagline: un_verified_tagline,
description: un_verified_description and
image : un_verified_images



Fire localhost:3001/api/v1/defaultMessage/?messageType=taglineAndDesc

to get the default messages, need to pass the *messageType*

Fire localhost:3001/api/v1/user/verify-taglinedescription to update the taglineAnd description, on success status

26th Jun

1. Fire localhost:3001/api/v1/user/users-stats to get user status on admin side
    Total users: All users no filter
    Pending users: status = 1
    Verified users: status = 2


TODO

Total Photos = Total Users
New Photos: Un Verified users/photos
Verified: we verified from admin
Pending verification : request sent


check post listing
localhost:3001/api/v1/date?sort=date&user_name=user@getnada.com&current_page=4


#1july

Chnage status from 0 to 1 ( falsy value issue )

update localhost:3001/api/v1/defaultMessage/requestMessage/?user_email_list=user@getnada.com&user_email_list=user1@getnada.com&messageType=taglineAndDesc&message_id=0 DONE

update to POST: DONE


1. localhost:3001/api/v1/user/user-by-name?user_name=user@getnada.com
Need all other info: DONE

2. Create one user on staging with all dummy data un_verified_images, un_verified_description and un_verified_tagline : DONE

3. Draft delete from admin side ( check old API )




Total Users
1. All users: Fire localhost:3001/api/v1/user with no status by deault it will return all the users.
2. Deactivated ( Blocked ):  Fire localhost:3001/api/v1/user?status=3 with status:3
3. Pending: Fire localhost:3001/api/v1/user?status=1 with status:1




1. user and phots influencers, ordering: sort by date : done
2. Tagline and description should be false by default : done
3. selfi doc approve : done
4. create influencers, update api : done

5. only active coupon should work
6. First time issue, message check.
7. Email verified, profile verified but docs not verified : new user: done



1. date range: common date, even if it's zero.




1. Message show karna hai notification, last notification

    notification category

    latest at top




status = 2 then all boolean = true



verified = true ( use )

request change sent = set every thing false

if user uploaded anything still false.



2. how to show last notification

1. Dashboard me GEO data not correct
    Country me city aa rahaii haii
2. Total users not coming correctly.
3. Past days past year not coming
4. Infinity showing

5. search on user basis, it should be on username also : done,  sort by default create date ( -1 )
6. order of promo code: by default create date ( -1 )
7. check is_new in post and users.
8. check error logs.
9. data not consistent
10. New one new label `warning` in post, warn date, once user submitted  ( edit submitted ) then it will go in resubmitted
11. influencer should be in soft delete. : Soft delete ( status : 4 )


New work

Notification module

1. If the user signed up first time and then if admin is sending him the request change with pre defined msg he should recieve a mail and if he logins he will see a page I.e notification or status set you can say with request change received and with msg and edit now button which will redirect the user to update the profile n submit again.



1. send change request first
    1.1 we will fire email and create a notification entry in DB
2. On user login fire localhost:3001/api/v1/notification?status=0&user_email=user1@getnada.com&sort=sent_time
    2.1 Show first message on user update screen if required.



2. If the user is verified and updates his or her profile after words normally and then the admin sends him request for change with msg he will receive a mail and also notification if he login he will see the red dot 🔴 in his profile n notification in menu which wee redirect him to notification recieved with msg and edit now option



1. Notification listing
    1.1 Total count
    1.2 Filter based on user email
2. Notification update
    2.1 Read, unread
3. Notification delete: soft delete
4. Particular notification detail ( complete message and status ) <-- Frontend work


2. Notification Manager
    2.1 mail ( We will fire mail )
    2.2 sms <-- Future scope
    2.3 Push notification <-- Future scope frontend work
