"""Change image column type to LONGBLOB

Revision ID: 421686497c1f
Revises: 63b6d33722ed
Create Date: 2024-07-28 08:10:05.356108

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '421686497c1f'
down_revision = '63b6d33722ed'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('faceimage', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=mysql.LONGBLOB(),
               type_=sa.LargeBinary(length=16777215),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('faceimage', schema=None) as batch_op:
        batch_op.alter_column('image',
               existing_type=sa.LargeBinary(length=16777215),
               type_=mysql.LONGBLOB(),
               existing_nullable=True)

    # ### end Alembic commands ###
