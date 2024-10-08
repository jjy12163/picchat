"""Add faceimageid to Chatbot table

Revision ID: 486f0da0b360
Revises: 5ca1f557d989
Create Date: 2024-08-11 09:16:34.352995

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '486f0da0b360'
down_revision = '5ca1f557d989'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chatbot', schema=None) as batch_op:
        batch_op.add_column(sa.Column('faceimage_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'faceimage', ['faceimage_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chatbot', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('faceimage_id')

    # ### end Alembic commands ###
