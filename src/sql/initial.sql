create table zoomzoomtour.USER
(
    user_uid      int auto_increment
        primary key,
    user_id       varchar(255)                             not null,
    user_pw       varchar(255)                             not null,
    user_name     varchar(255)                             not null,
    user_nickname varchar(255)                             null,
    user_email    varchar(255)                             not null,
    created_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at    datetime(6)                              null,
    constraint IDX_3e87ae4083c0762d3f226c35fb
        unique (user_email),
    constraint IDX_7e95c49ceadc1951ae0ea829b2
        unique (user_id)
);

create table zoomzoomtour.SELLER
(
    seller_uid      int auto_increment
        primary key,
    seller_uuid     varchar(36)                              not null,
    seller_name     varchar(255)                             not null,
    seller_nickname varchar(255)                             null,
    is_activate     tinyint     default 0                    not null,
    created_at      datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at      datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at      datetime(6)                              null,
    user_uid        int                                      not null,
    constraint IDX_59f45b6c4b47508fcb84c183d9
        unique (seller_uuid),
    constraint REL_207c082ff77a58e11a917ce22c
        unique (user_uid),
    constraint FK_207c082ff77a58e11a917ce22cb
        foreign key (user_uid) references zoomzoomtour.USER (user_uid)
);

create table zoomzoomtour.TOUR
(
    tour_uid         int auto_increment
        primary key,
    tour_title       varchar(255)                             not null,
    tour_description varchar(255)                             null,
    created_at       datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at       datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at       datetime(6)                              null,
    tour_code        varchar(255)                             not null,
    sellerSellerUid  int                                      null,
    constraint FK_2aca1985ce0d3e8a62ca0ecbcef
        foreign key (sellerSellerUid) references zoomzoomtour.SELLER (seller_uid)
            on delete set null
);

create table zoomzoomtour.IRREGULAR_OFF_DAY
(
    irregular_off_day_uid int auto_increment
        primary key,
    created_at            datetime(6) default CURRENT_TIMESTAMP(6) not null,
    tour_uid              int                                      not null,
    date                  date                                     not null,
    constraint REL_49976011f716ebd4064193bc5b
        unique (tour_uid),
    constraint FK_49976011f716ebd4064193bc5be
        foreign key (tour_uid) references zoomzoomtour.TOUR (tour_uid)
);

create table zoomzoomtour.REGULAR_OFF_DAY
(
    monday              tinyint     default 0                    not null,
    tuesday             tinyint     default 0                    not null,
    wednesday           tinyint     default 0                    not null,
    thursday            tinyint     default 0                    not null,
    friday              tinyint     default 0                    not null,
    saturday            tinyint     default 0                    not null,
    sunday              tinyint                                  not null,
    regular_off_day_uid int auto_increment
        primary key,
    created_at          datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at          datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    tour_uid            int                                      not null,
    constraint REL_43d993dfeb91a37ed3a9c3bcfa
        unique (tour_uid),
    constraint FK_43d993dfeb91a37ed3a9c3bcfaa
        foreign key (tour_uid) references zoomzoomtour.TOUR (tour_uid)
);

create table zoomzoomtour.RESERVATION
(
    reservation_uid    int auto_increment
        primary key,
    reservation_uuid   varchar(36)                                                not null,
    reservation_status enum ('대기', '승인', '거절', '취소') default '대기'                 not null,
    created_at         datetime(6)                   default CURRENT_TIMESTAMP(6) not null,
    updated_at         datetime(6)                   default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at         datetime(6)                                                null,
    date               date                                                       not null,
    tourTourUid        int                                                        not null,
    user_uid           int                                                        not null,
    constraint IDX_92e084ceccb444ed8cf409a34e
        unique (reservation_uuid),
    constraint REL_f186cb9f2f9258f9fe9c51c2fc
        unique (user_uid),
    constraint FK_4b3c511d60f4dbe90224d3dc706
        foreign key (tourTourUid) references zoomzoomtour.TOUR (tour_uid),
    constraint FK_f186cb9f2f9258f9fe9c51c2fca
        foreign key (user_uid) references zoomzoomtour.USER (user_uid)
);

